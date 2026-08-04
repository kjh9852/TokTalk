import { useRef } from "react";

import { useMobileControlStore } from "@/store/mobileControlsStore";
import { useUserStore } from "@/store/userStore";
import { isMobile } from "@/utils/device";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";

import usePointerLock from "@/hooks/usePointerLock";

import PlayerModel from "@/canvas/player/PlayerModel";
import useKnockback from "@/canvas/player/hooks/useKnockback";
import { usePersonControls } from "@/canvas/player/hooks/usePersonControls";
import { handleJump } from "@/canvas/player/utils/handleJump";
import { handlePush } from "@/canvas/player/utils/handlePush";
import { syncPlayerState } from "@/canvas/player/utils/sycnPlayerState";
import { updateCamera } from "@/canvas/player/utils/updateCamera";

const MOVE_SPEED = 4;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const tempQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler();

export default function Player({
  onUpdate,
  isTyping,
  message,
  nickname,
  socket,
  players,
}) {
  const playerRef = useRef();
  const lastSentRef = useRef(0);
  const mobileMove = useMobileControlStore((state) => state.mobileMove);
  const mobileLook = useMobileControlStore((state) => state.mobileLook);
  const mobileAction = useMobileControlStore((state) => state.mobileAction);
  const movement = usePersonControls();
  const setMyPosition = useUserStore((state) => state.setMyPosition);
  const { isLock } = usePointerLock();
  const prevPushRef = useRef(false);
  const { isKnockback } = useKnockback({
    socket,
    playerRef,
    onUpdate,
  });

  const playerInput = isMobile
    ? {
        ...mobileMove,
        ...mobileLook,
        ...mobileAction,
      }
    : movement;

  const pushCooldownRef = useRef(0);
  const isJumpingRef = useRef(false);
  const jumpCountRef = useRef(2);

  const isMoving =
    playerInput.forward ||
    playerInput.backward ||
    playerInput.left ||
    playerInput.right;

  const rapier = useRapier();

  const doJump = (isDoubleJump) => {
    const jumpForce = isDoubleJump ? 7 : 8;
    playerRef.current.setLinvel({ x: 0, y: jumpForce, z: 0 });
  };

  useFrame((state) => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();

    // 방향 계산
    frontVector.set(0, 0, playerInput.backward - playerInput.forward);
    sideVector.set(playerInput.left - playerInput.right, 0, 0);
    direction.set(0, 0, 0);

    if (isLock) {
      if (isMoving && !isKnockback) {
        console.log("move!");
        const CURRENT_SPEED = playerInput.run ? MOVE_SPEED * 1.8 : MOVE_SPEED;

        direction
          .subVectors(frontVector, sideVector)
          .normalize()
          .applyAxisAngle(UP_AXIS, playerInput.yaw) // 캐릭터 회전 적용
          .multiplyScalar(CURRENT_SPEED);

        playerRef.current.wakeUp();

        playerRef.current.setLinvel({
          x: direction.x,
          y: velocity.y,
          z: direction.z,
        });
      }

      tempQuat.setFromEuler(tempEuler.set(0, playerInput.yaw + Math.PI, 0));

      playerRef.current.setRotation(tempQuat);

      handleJump({
        playerRef,
        rapier,
        jumpCountRef,
        isJumpingRef,
        jump: playerInput.jump,
        doJump,
      });

      if (playerInput.push && !prevPushRef.current) {
        handlePush({
          pushCooldownRef,
          playerRef,
          players,
          socket,
          yaw: playerInput.yaw,
        });
      }

      prevPushRef.current = playerInput.push;

      updateCamera({
        playerRef,
        camera: state.camera,
        yaw: playerInput.yaw,
        pitch: playerInput.pitch,
      });

      const now = state.clock.getElapsedTime() * 1000;

      syncPlayerState({
        now,
        playerRef,
        setMyPosition,
        isMoving,
        lastSentRef,
        onUpdate,
      });
    }
  });

  return (
    <RigidBody
      colliders={false}
      mass={1}
      type="dynamic"
      ref={playerRef}
      lockRotations
      position={[0, 5, -8]}
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
