import { useRef } from "react";

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

const tempLookDir = new THREE.Vector3();
const tempLookTarget = new THREE.Vector3();
const tempCameraPos = new THREE.Vector3();

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const tempQuat = new THREE.Quaternion();
const tempPitchQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler();

export default function Player({
  isPointerLocked,
  onUpdate,
  isTyping,
  message,
  nickname,
}) {
  const playerRef = useRef();
  const lastSentRef = useRef(0);
  const { forward, backward, left, right, jump, run, yaw, pitch } =
    usePersonControls();

  const isMoving = forward || backward || left || right;

  const rapier = useRapier();

  useFrame((state) => {
    if (!playerRef.current) return;
    if (!isPointerLocked) return;

    const velocity = playerRef.current.linvel();

    // 방향 계산
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction.set(0, 0, 0);

    if (isMoving) {
      const CURRENT_SPEED = run ? MOVE_SPEED * 1.8 : MOVE_SPEED;

      direction
        .subVectors(frontVector, sideVector)
        .normalize()
        .applyAxisAngle(UP_AXIS, yaw) // 캐릭터 회전 적용
        .multiplyScalar(CURRENT_SPEED);

      playerRef.current.wakeUp();
      playerRef.current.setLinvel({
        x: direction.x,
        y: velocity.y,
        z: direction.z,
      });
    }

    tempQuat.setFromEuler(tempEuler.set(0, yaw + Math.PI, 0));
    // 캐릭터 회전 적용
    playerRef.current.setRotation(tempQuat);

    // 점프 처리
    const world = rapier.world;
    const ray = world.castRay(
      new RAPIER.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 }),
    );
    if (ray) {
      console.log("현재 내 캐릭터의 바닥 거리:", ray.timeOfImpact);
    }
    const grounded = ray && ray.collider && Math.abs(ray.timeOfImpact) <= 0.65;
    if (jump && grounded) doJump();

    // 카메라 위치: 캐릭터 뒤쪽 위치로 고정
    const pos = playerRef.current.translation();

    const yawOffset = new THREE.Vector3(0, 0, 4).applyAxisAngle(UP_AXIS, yaw);

    const pitchQuat = tempPitchQuat.setFromEuler(tempEuler.set(pitch, 0, 0));

    const lookDir = tempLookDir.set(0, 0, -1).applyQuaternion(pitchQuat);
    lookDir.applyAxisAngle(UP_AXIS, yaw);

    const lookTarget = tempLookTarget
      .set(pos.x, pos.y + 1.5, pos.z)
      .add(lookDir);

    const cameraPos = tempCameraPos
      .set(pos.x, pos.y + 1.5, pos.z)
      .add(yawOffset);

    state.camera.position.copy(cameraPos);
    state.camera.lookAt(lookTarget); // 캐릭터 머리 쪽 보기

    const now = state.clock.getElapsedTime() * 1000;

    if (now - lastSentRef.current > 50) {
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
        isMoving: isMoving,
      };
      onUpdate(newState); // 부모 컴포넌트를 통해 서버에 데이터 전송

      lastSentRef.current = now;
    }
  });

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 10, z: 0 });
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
