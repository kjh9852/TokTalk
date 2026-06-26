import { useEffect, useRef } from "react";

import * as RAPIER from "@dimforge/rapier3d-compat";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";

import { usePersonControls } from "@/hooks/usePersonControls";

import PlayerModel from "@/canvas/PlayerModel";

const MOVE_SPEED = 4;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

export default function Player({
  isPointerLocked,
  onUpdate,
  isTyping,
  message,
  nickname,
}) {
  const playerRef = useRef();
  const { forward, backward, left, right, jump, yaw, pitch } =
    usePersonControls();

  const isMoving = forward || backward || left || right;

  const rapier = useRapier();

  useEffect(() => {
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
  }, [onUpdate]);

  useFrame((state) => {
    if (!playerRef.current) return;

    if (!isPointerLocked) return;

    const velocity = playerRef.current.linvel();

    // 방향 계산
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction.set(0, 0, 0);

    if (forward || backward || left || right) {
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

  return (
    <RigidBody
      colliders={false}
      mass={1}
      type={"dynamic"}
      ref={playerRef}
      lockRotations
      position={[0, 10, 0]}
    >
      <CapsuleCollider args={[0.2, 0.4]} />
      <PlayerModel
        nickname={nickname}
        message={message}
        isTyping={isTyping}
        isMoving={isMoving}
      />
    </RigidBody>
  );
}
