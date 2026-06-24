import { useEffect, useMemo, useRef, useState } from "react";

import * as RAPIER from "@dimforge/rapier3d-compat";
import {
  Billboard,
  RoundedBox,
  Text,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

import { usePersonControls } from "@/hooks/usePersonControls";

const MOVE_SPEED = 4;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export default function Player({
  isLocal,
  isPointerLocked,
  onUpdate,
  position,
  rotation,
  isMoving,
  isTyping,
  message,
  nickname,
}) {
  const { scene, animations } = useGLTF("models/pinkbin.glb");
  const { actions, ref } = useAnimations(animations);
  const playerRef = useRef();
  const chatRef = useRef();
  const [chatBoxSize, setChatBoxSize] = useState([0, 0]);
  const { forward, backward, left, right, jump, yaw, pitch } =
    usePersonControls();

  const rapier = useRapier();

  const textContent = isTyping && !message ? "..." : message;

  const DEFAULT_CHATBOX_SIZE = [0.05, 0.15];

  useEffect(() => {
    if (!chatRef.current || !message) {
      setChatBoxSize(DEFAULT_CHATBOX_SIZE);
      return;
    }

    const interval = setInterval(() => {
      const box = new THREE.Box3().setFromObject(chatRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);

      if (size.x > 0 && size.y > 0) {
        setChatBoxSize([size.x, size.y]);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [message]);

  useEffect(() => {
    if (!ref.current || !actions) return;

    if (actions) {
      actions.defalut.play();
    }
  }, [actions]);

  useEffect(() => {
    if (isLocal || !actions) return;

    if (isMoving) {
      actions.walk?.reset().fadeIn(0.2).play();
    } else {
      actions.walk?.reset().fadeIn(0.2).stop();
    }
  }, [isLocal, isMoving, actions]);

  const cloneScene = useMemo(() => {
    const cloned = clone(scene);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  useEffect(() => {
    if (isLocal) {
      // 로컬 플레이어 상태를 서버로 주기적으로 전송
      const interval = setInterval(() => {
        const isMoving = forward || backward || left || right;
        const playerPosition = playerRef.current.translation();
        const playerRotation = playerRef.current.rotation();
        const newState = {
          position: [playerPosition.x, playerPosition.y, playerPosition.z],
          rotation: [
            playerRotation.x,
            playerRotation.y,
            playerRotation.z,
            playerRotation.w,
          ],
          isMoving,
        };
        onUpdate(newState); // 부모 컴포넌트를 통해 서버에 데이터 전송
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLocal, onUpdate, forward, backward, left, right]);

  useFrame((state) => {
    if (!isPointerLocked) return;
    if (!playerRef.current) return;
    if (!isLocal) return;
    const velocity = playerRef.current.linvel();

    // 방향 계산
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction.set(0, 0, 0);

    if (forward || backward || left || right) {
      actions.defalut.stop();
      actions.walk?.play();
      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw) // 캐릭터 회전 적용
        .multiplyScalar(MOVE_SPEED);

      playerRef.current.wakeUp();
      playerRef.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });
    } else {
      actions.defalut.play();
      actions.walk.stop();
    }

    const quat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, yaw + Math.PI, 0),
    );
    // 캐릭터 회전 적용
    playerRef.current.setRotation({
      x: quat.x,
      y: quat.y,
      z: quat.z,
      w: quat.w,
    });

    // console.log(quat);

    // 점프 처리
    const world = rapier.world;
    const ray = world.castRay(
      new RAPIER.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 }),
    );
    const grounded = ray && ray.collider && Math.abs(ray.timeOfImpact) <= 1.5;
    if (jump && grounded) doJump();

    // 카메라 위치: 캐릭터 뒤쪽 위치로 고정
    const pos = playerRef.current.translation();

    const yawOffset = new THREE.Vector3(0, 0, 4).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yaw,
    );

    const pitchQuat = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(pitch, 0, 0),
    );

    const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(pitchQuat);
    lookDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

    const lookTarget = new THREE.Vector3(pos.x, pos.y + 1.5, pos.z).add(
      lookDir,
    );

    const cameraPos = new THREE.Vector3(pos.x, pos.y + 1.5, pos.z).add(
      yawOffset,
    );

    state.camera.position.copy(cameraPos);
    state.camera.lookAt(lookTarget); // 캐릭터 머리 쪽 보기
  });

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 8, z: 0 });
  };

  useEffect(() => {
    if (!isLocal && playerRef.current && rotation) {
      const quat = new THREE.Quaternion(
        rotation[0],
        rotation[1],
        rotation[2],
        rotation[3],
      );
      playerRef.current.setRotation(quat, true);
    }
  }, [rotation, isLocal]);

  return (
    <RigidBody
      colliders={false}
      mass={1}
      ref={playerRef}
      lockRotations
      position={position ?? [0, 10, 0]}
    >
      <CapsuleCollider args={[0.2, 0.4]} />
      <group ref={ref}>
        <primitive object={cloneScene} />
        <Billboard position={[0, 0.7, 0]}>
          <Text
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.005}
            outlineColor="black"
            whiteSpace="normal"
            overflowWrap="break-word"
          >
            {nickname}
          </Text>
        </Billboard>
        {(message || isTyping) && (
          <Billboard position={[0, 1, 0]}>
            <RoundedBox
              position={[0, chatBoxSize[1] / 2 - 0.01, -0.01]}
              args={[chatBoxSize[0] + 0.5, chatBoxSize[1] + 0.05, 0.01]} // x, y, z 크기
              radius={0.05} // 모서리 반지름
              smoothness={4} // 곡률 부드럽기
            >
              <meshBasicMaterial color="black" transparent opacity={0.7} />
            </RoundedBox>
            <Text
              ref={chatRef}
              fontSize={0.15}
              maxWidth={1.5}
              lineHeight={1.2}
              whiteSpace="normal"
              overflowWrap="break-word"
              color="white"
              anchorX="center"
              anchorY="bottom"
            >
              {textContent}
            </Text>
          </Billboard>
        )}
      </group>
    </RigidBody>
  );
}

useGLTF.preload("pinkbin.glb");
