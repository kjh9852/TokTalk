import { useEffect, useRef } from "react";

import { useInteractionStore } from "@/store/interactionStore";
import { useUserStore } from "@/store/userStore";
import { isWithDistance } from "@/utils/distance";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import TriangleButton from "@/canvas/world/TriangleButton";

export default function Board({ onPostNext, onPostPrev }) {
  const { scene } = useGLTF("/models/board.glb");
  const myPosition = useUserStore((state) => state.myPosition);
  const boardRef = useRef();
  const nextPageRef = useRef(onPostNext);
  const prevPageRef = useRef(onPostPrev);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    nextPageRef.current = onPostNext;
    prevPageRef.current = onPostPrev;
  }, [onPostNext, onPostPrev]);

  useEffect(() => {
    const { addInteractable, removeInteractable } =
      useInteractionStore.getState();

    addInteractable({
      id: "board-prev",
      icon: "prev",
      position: {
        x: 9,
        z: 3.85,
      },
      range: 3,
      interact: () => {
        console.log("prev interact");
        prevPageRef.current();
      },
    });

    addInteractable({
      id: "board-next",
      icon: "next",
      position: {
        x: 7,
        z: 3.85,
      },
      range: 3,
      interact: () => {
        console.log("next interact");
        nextPageRef.current();
      },
    });

    return () => {
      removeInteractable("board-prev");
      removeInteractable("board-next");
    };
  }, []);

  return (
    <>
      <RigidBody type="fixed" ref={boardRef} position={[8, 0, 4]}>
        <group>
          <primitive object={scene} />
        </group>
      </RigidBody>
      <TriangleButton
        onClick={() => {
          if (!isWithDistance(myPosition, { x: 8, z: 4 }, 5)) {
            return;
          }
          onPostPrev();
        }}
      />
      <TriangleButton
        onClick={() => {
          if (!isWithDistance(myPosition, { x: 8, z: 4 }, 5)) {
            return;
          }
          onPostNext();
        }}
        type="next"
      />
    </>
  );
}

useGLTF.preload("/models/board.glb");
