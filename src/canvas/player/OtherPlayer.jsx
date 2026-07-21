import { useRef } from "react";

import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

import PlayerModel from "@/canvas/player/PlayerModel";

export default function OtherPlayer({
  position,
  rotation,
  isMoving,
  nickname,
  message,
  isTyping,
}) {
  const playerRef = useRef();

  const targetPos = useRef(new THREE.Vector3());
  const targetQuat = useRef(new THREE.Quaternion());

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    if (position) {
      targetPos.current.set(position[0], position[1], position[2]);

      // 현재 라피어 물리 바디의 위치를 가져옵니다.
      const currentPos = playerRef.current.translation();
      const currentPosVec = new THREE.Vector3(
        currentPos.x,
        currentPos.y,
        currentPos.z,
      );

      // 매 프레임마다 목적지를 향해 15%씩 미끄러지듯 이동 (0.15 값을 조절해 부드러움 설정 가능)
      currentPosVec.lerp(targetPos.current, 1 - Math.exp(-12.5 * delta));

      // 보간된 위치를 물리 엔진 바디에 부드럽게 반영
      playerRef.current.setNextKinematicTranslation(currentPosVec);
    }

    // 2. 부모(소켓)에게 받은 최신 회전 Quaternion 배열 적용
    if (rotation) {
      targetQuat.current.set(
        rotation[0],
        rotation[1],
        rotation[2],
        rotation[3],
      );

      // 현재 라피어 물리 바디의 회전값을 쿼터니언으로 변환
      const currentRot = playerRef.current.rotation();
      const currentQuat = new THREE.Quaternion(
        currentRot.x,
        currentRot.y,
        currentRot.z,
        currentRot.w,
      );

      // 회전도 부드럽게 slerp(구면 선형 보간) 처리
      currentQuat.slerp(targetQuat.current, 0.15);

      playerRef.current.setNextKinematicRotation(currentQuat);
    }
  });

  return (
    <RigidBody
      colliders={false}
      mass={1}
      type="kinematicPosition"
      ref={playerRef}
      lockRotations
      position={position ?? [0, 5, 0]}
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
