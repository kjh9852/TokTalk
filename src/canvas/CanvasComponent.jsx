import { useCallback, useEffect } from "react";

import { useModalStore } from "@/store/modalStore";
import { useUserStore } from "@/store/userStore";
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

export default function CanvasComponent({ socket, nickname }) {
  const { setIsLock } = usePointerLock();
  const setControls = useUserStore((state) => state.setControls);
  const isOpen = useModalStore((state) => state.isOpen);
  const players = usePlayerSocket(socket, nickname);

  // 플레이어 업데이트 함수
  const handlePlayerUpdate = useCallback((state) => {
    socket.emit("updatePlayer", { state });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", { nickname });
  }, []);

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
        {!isOpen && (
          <PointerLockControls
            ref={(instance) => {
              if (!instance) return;
              setControls(instance);
            }}
            onLock={() => {
              setIsLock(true);
            }}
            onUnlock={() => {
              setIsLock(false);
            }}
          />
        )}

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
          <Post />
          <Signpost />
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
            <group position={[11.5, 0.9, 3]} rotation={[0, 2, 0]}>
              <Yeti />
            </group>
          </RigidBody>
        </Physics>
      </Canvas>
    </div>
  );
}
