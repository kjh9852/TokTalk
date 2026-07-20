import { Suspense, useCallback, useEffect } from "react";

import { useModalStore } from "@/store/modalStore";
import { useUserStore } from "@/store/userStore";
import { PointerLockControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

import usePointerLock from "@/hooks/usePointerLock";

import ModelLoader from "@/canvas/loader/ModelLoader";
import PhysicsWorld from "@/canvas/physics/PhysicsWorld";
import PlayerManager from "@/canvas/player/PlayerManager";
import usePlayerSocket from "@/canvas/player/hooks/usePlayerSocket";
import Ground from "@/canvas/world/Ground";
import Signpost from "@/canvas/world/Signpost";
import Wall from "@/canvas/world/Wall";
import World from "@/canvas/world/World";
import Yeti from "@/canvas/world/Yeti";

import Post from "@/components/post/Post";

export default function CanvasComponent({ socket, nickname, onModelLoaded }) {
  const { setIsLock } = usePointerLock();
  const setControls = useUserStore((state) => state.setControls);
  const isOpen = useModalStore((state) => state.isOpen);
  const players = usePlayerSocket(socket, nickname);

  // 플레이어 업데이트 함수
  const handlePlayerUpdate = useCallback(
    (state) => {
      socket.emit("updatePlayer", { state });
    },
    [socket],
  );

  useEffect(() => {
    if (!socket) return;
    socket.emit("join", { nickname });
  }, [socket, nickname]);

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
        <Suspense fallback={null}>
          <ModelLoader onLoaded={onModelLoaded} />
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

          <World />
          <PhysicsWorld>
            <Wall />
            <Ground />
            <Post />
            <Signpost />
            <PlayerManager
              players={players}
              socket={socket}
              onPlayerUpdate={handlePlayerUpdate}
            />
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
          </PhysicsWorld>
        </Suspense>
      </Canvas>
    </div>
  );
}
