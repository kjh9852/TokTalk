import { useEffect, useRef, useState } from "react";

import { useModalContext } from "@/context/ModalContextProvider";
import { useUserContext } from "@/context/UserContextProvider";
import { PointerLockControls, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";

import usePointerLock from "@/hooks/usePointerLock";

import Player from "@/canvas/Player";
import Signpost from "@/canvas/Signpost";
import Yeti from "@/canvas/Yeti";

import Post from "@/components/post/Post";

import Ground from "./Ground";

const shadowOffset = 50;

export default function CanvasComponent({ socket, nickname, isPointerLocked }) {
  usePointerLock();
  const { controlsRef, isLock, setIsLock } = useUserContext();
  const { isOpen } = useModalContext();
  const [players, setPlayers] = useState({});
  const localPlayerRef = useRef({});
  const messageTimer = useRef({});

  // 플레이어 업데이트 함수
  const handlePlayerUpdate = (state) => {
    socket.emit("updatePlayer", { state });
  };

  useEffect(() => {
    socket.emit("join", { nickname });
  }, [nickname, socket]);

  useEffect(() => {
    const handleCurrentPlayers = (currentPlayers) => {
      setPlayers(currentPlayers);
    };

    const handleNewPlayer = ({ id, state }) => {
      setPlayers((prev) => ({ ...prev, [id]: state }));
    };

    const handleUpdatePlayer = ({ id, state }) => {
      setPlayers((prev) => ({ ...prev, [id]: state }));
    };

    const handleRemovePlayer = (id) => {
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[id];
        return newPlayers;
      });
    };

    const handlePlayerTyping = ({ id }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], isTyping: true },
      }));
      console.log(id);
    };

    const handlePlayerStopTyping = ({ id }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], isTyping: false },
      }));
    };

    socket.on("receive message", ({ id, message }) => {
      console.log("받은 메시지 id:", id);
      console.log("현재 players keys:", Object.keys(players));

      setPlayers((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], currentMessage: message },
        };
      });
    });

    socket.on("clear message", ({ id }) => {
      console.log("클라이언트 clear message 수신:", id);
      setPlayers((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], currentMessage: "" },
        };
      });
    });

    socket.on("currentPlayers", handleCurrentPlayers);
    socket.on("newPlayer", handleNewPlayer);
    socket.on("updatePlayer", handleUpdatePlayer);
    socket.on("removePlayer", handleRemovePlayer);
    socket.on("typing", handlePlayerTyping);
    socket.on("stopTyping", handlePlayerStopTyping);

    return () => {
      socket.off("currentPlayers", handleCurrentPlayers);
      socket.off("newPlayer", handleNewPlayer);
      socket.off("updatePlayer", handleUpdatePlayer);
      socket.off("removePlayer", handleRemovePlayer);
      socket.off("typing", handlePlayerTyping);
      socket.off("stopTyping", handlePlayerStopTyping);
      socket.off("receive message");
      socket.off("clear message");
      Object.values(messageTimer.current).forEach(clearTimeout);
      messageTimer.current = {};
    };
  }, [socket]);

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
        <Physics gravity={[0, -30, 0]} debug>
          <Ground />
          <Post isEdit={isPointerLocked} />
          <Signpost controlsRef={controlsRef} />
          {Object.entries(players).map(([id, state]) => (
            <Player
              key={id}
              id={id}
              setPlayers={setPlayers}
              isLocal={id === socket.id}
              onUpdate={handlePlayerUpdate}
              isTyping={state.isTyping}
              message={state.currentMessage}
              rotation={state.rotation}
              position={state.position}
              isMoving={state.isMoving}
              nickname={state.nickname ?? "익명"}
              ref={localPlayerRef.current[players.id]}
              isPointerLocked={isLock}
            />
          ))}
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
