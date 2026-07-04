import { useEffect, useRef } from "react";

import { useUserStore } from "@/store/userStore";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { useFrame } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";

import { usePersonControls } from "@/hooks/usePersonControls";
import usePointerLock from "@/hooks/usePointerLock";

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
  onUpdate,
  isTyping,
  message,
  nickname,
  socket,
  players,
}) {
  const playerRef = useRef();
  const lastSentRef = useRef(0);
  const { forward, backward, left, right, jump, run, yaw, pitch, push } =
    usePersonControls();
  const setMyPosition = useUserStore((state) => state.setMyPosition);
  const { isLock } = usePointerLock();
  const prevPushRef = useRef(false);
  const knockbackUntil = useRef(0);
  const pushCooldownRef = useRef(0);
  const isJumpingRef = useRef(false);
  const jumpCountRef = useRef(2);

  const isMoving = forward || backward || left || right;

  const rapier = useRapier();

  const handlePush = () => {
    const now = Date.now();
    if (now < pushCooldownRef.current) return;

    pushCooldownRef.current = now + 1000;

    const myPos = playerRef.current.translation();

    const forwardVector = new THREE.Vector3(0, 0, -1).applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yaw,
    );

    let targetId = null;
    let nearestDistance = Infinity;

    Object.entries(players).forEach(([id, state]) => {
      if (id === socket.id) return;

      const dx = state.position[0] - myPos.x;
      const dz = state.position[2] - myPos.z;

      const distance = Math.sqrt(dx * dx + dz * dz);

      if (distance > 3) return;

      const directionToTarget = new THREE.Vector3(dx, 0, dz).normalize();

      const dot = forwardVector.dot(directionToTarget);

      if (dot < 0.7) return;

      if (distance < nearestDistance) {
        nearestDistance = distance;
        targetId = id;
      }
    });

    if (!targetId) return;

    socket.emit("pushPlayer", {
      targetId,
    });
  };

  const doJump = (isDoubleJump) => {
    const jumpForce = isDoubleJump ? 7 : 8;
    playerRef.current.setLinvel({ x: 0, y: jumpForce, z: 0 });
  };

  useEffect(() => {
    if (!socket) return;

    const handleKnockback = ({ x, z }) => {
      knockbackUntil.current = performance.now() + 300;

      playerRef.current?.applyImpulse(
        {
          x: x * 3,
          y: 2,
          z: z * 3,
        },
        true,
      );

      // 넉백 적용 후 즉시 위치 동기화
      setTimeout(() => {
        const pos = playerRef.current?.translation();
        const rot = playerRef.current?.rotation();

        if (!pos || !rot) return;

        onUpdate({
          position: [pos.x, pos.y, pos.z],
          rotation: [rot.x, rot.y, rot.z, rot.w],
          isMoving: true,
        });
      }, 100);
    };

    socket.on("knockback", handleKnockback);

    return () => {
      socket.off("knockback", handleKnockback);
    };
  }, [socket, onUpdate]);

  useFrame((state) => {
    if (!playerRef.current) return;

    const velocity = playerRef.current.linvel();
    // console.log(velocity.x, velocity.z);

    // 방향 계산
    frontVector.set(0, 0, backward - forward);
    sideVector.set(left - right, 0, 0);
    direction.set(0, 0, 0);

    const isKnockback = performance.now() < knockbackUntil.current;

    if (isLock) {
      if (isMoving && !isKnockback) {
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
      const playerPos = playerRef.current.translation();

      const maxDistance = 0.8;
      const rayDirection = { x: 0, y: -1, z: 0 };

      const filter = {
        flags: RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
        excludeRigidBody: playerRef.current,
        excludeCollider: null,
        groups: null,
      };

      const ray = world.castRay(
        new RAPIER.Ray(playerPos, rayDirection),
        maxDistance,
        true,
        null,
        null,
        filter,
        playerRef.current,
      );

      const grounded =
        ray && ray.collider && Math.abs(ray.timeOfImpact) <= 0.65;

      if (grounded) {
        jumpCountRef.current = 2;
        isJumpingRef.current = false;
      } else {
        if (!jump) {
          isJumpingRef.current = false;
        }
      }

      if (jump && jumpCountRef.current > 0 && !isJumpingRef.current) {
        isJumpingRef.current = true;
        jumpCountRef.current -= 1;

        const isDoubleJump = jumpCountRef.current === 0;

        doJump(isDoubleJump);
      }

      if (push && !prevPushRef.current) {
        handlePush();
      }

      prevPushRef.current = push;

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

      if (now - lastSentRef.current > 100) {
        const playerPosition = playerRef.current.translation();
        const playerRotation = playerRef.current.rotation();

        setMyPosition({
          x: playerPosition.x,
          y: playerPosition.y,
          z: playerPosition.z,
        });

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
    }
  });

  return (
    <RigidBody
      colliders={false}
      mass={1}
      type={"dynamic"}
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
