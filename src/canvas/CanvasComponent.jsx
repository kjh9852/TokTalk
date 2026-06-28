import { useCallback, useEffect, useRef, useState } from "react";

import { useModalContext } from "@/context/ModalContextProvider";
import { useUserContext } from "@/context/UserContextProvider";
import { PointerLockControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";

import usePlayerSocket from "@/hooks/usePlayerSocket";
import usePointerLock from "@/hooks/usePointerLock";

import OtherPlayer from "@/canvas/OtherPlayer";
import Player from "@/canvas/Player";
import Signpost from "@/canvas/Signpost";
import Wall from "@/canvas/Wall";
import Yeti from "@/canvas/Yeti";

import Post from "@/components/post/Post";

import Ground from "./Ground";

const shadowOffset = 50;

export default function CanvasComponent({ socket, nickname, isPointerLocked }) {
  const { isLock, setIsLock } = usePointerLock();
  const { controlsRef } = useUserContext();
  const { isOpen } = useModalContext();
  const players = usePlayerSocket(socket, nickname);
  const localPlayerRef = useRef({});

  // 플레이어 업데이트 함수
  const handlePlayerUpdate = useCallback((state) => {
    socket.emit("updatePlayer", { state });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.emit("join", { nickname });
  }, []);

  useEffect(() => {
    if (isOpen) {
      controlsRef.current.unlock();
      controlsRef.current.isLocked = false;
      controlsRef.current.enabled = false;
    }
  }, [isOpen]);

  return (
    <div id="container">
      <div id="aim" />
      <Canvas
        id="canvas"
        camera={{
          fov: 50,
          position: [0, 3, 0],
        }}
        shadows
      >
        <PointerLockControls
          ref={controlsRef}
          onLock={() => {
            controlsRef.current.enabled = true;
            setIsLock(true);
          }}
          onUnlock={() => {
            // isLock이 true일 때만 실행
            controlsRef.current.enabled = false;
            setIsLock(false);
          }}
        />

        <Sky sunPosition={[-500, 50, -100]} />
        <ambientLight intensity={1.5} />
        <directionalLight
          castShadow
          intensity={0.5}
          position={[0, 100, -50]}
          shadow-mapSize={4096}
          shadow-camera-top={shadowOffset}
          shadow-camera-bottom={-shadowOffset}
          shadow-camera-left={shadowOffset}
          shadow-camera-right={-shadowOffset}
        />
        <Physics gravity={[0, -30, 0]}>
          <Wall />
          <Ground />
          <Post isEdit={isPointerLocked} />
          <Signpost controlsRef={controlsRef} />
          {Object.entries(players).map(([id, state]) => {
            const isLocal = id === socket.id;
            return isLocal ? (
              <Player
                key={id}
                id={id}
                onUpdate={handlePlayerUpdate}
                isTyping={state.isTyping}
                message={state.currentMessage}
                nickname={state.nickname ?? "익명"}
                ref={localPlayerRef.current[id]}
                isPointerLocked={isLock}
                socket={socket}
                players={players}
              />
            ) : (
              <OtherPlayer
                key={id}
                id={id}
                position={state.position}
                rotation={state.rotation}
                isTyping={state.isTyping}
                isMoving={state.isMoving}
                message={state.currentMessage}
                nickname={state.nickname ?? "익명"}
              />
            );
          })}

          <RigidBody>
            <mesh position={[0, 5, -5]}>
              <boxGeometry />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" mass={1000}>
            <group position={[3, 0.58, 0]}>
              <Yeti />
            </group>
          </RigidBody>
        </Physics>
      </Canvas>
    </div>
  );
}
