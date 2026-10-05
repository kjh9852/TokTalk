import { useEffect, useRef } from "react";

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

  const targetQuat = useRef(new THREE.Quaternion());

  const nextPos = useRef(new THREE.Vector3());

  const snapshots = useRef([]);

  useEffect(() => {
    if (!position || !playerRef.current) return;

    snapshots.current.push({
      time: performance.now(),
      position: new THREE.Vector3(position[0], position[1], position[2]),
    });

    if (snapshots.current.length === 0) {
      playerRef.current.setTranslation(snapshots.position, true);
    }

    if (snapshots.current.length > 10) {
      snapshots.current.shift();
    }
  }, [position]);

  const INTTERPOLATION_DELAY = 200;

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    const buffer = snapshots.current;
    const renderTime = performance.now() - INTTERPOLATION_DELAY;

    while (buffer.length >= 2 && buffer[1].time <= renderTime) {
      buffer.shift();
    }

    if (buffer.length < 2) return;

    const from = buffer[0];
    const to = buffer[1];

    const duration = to.time - from.time;

    if (duration <= 0) return;

    const t = THREE.MathUtils.clamp((renderTime - from.time) / duration, 0, 1);

    nextPos.current.lerpVectors(from.position, to.position, t);

    playerRef.current.setNextKinematicTranslation(nextPos.current);

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
      const alpha = 1 - Math.exp(-12.5 * delta);
      currentQuat.slerp(targetQuat.current, alpha);

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
