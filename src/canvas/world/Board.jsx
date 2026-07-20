import { useEffect, useRef } from "react";

import { useUserStore } from "@/store/userStore";
import { isWithDistance } from "@/utils/distance";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import TriangleButton from "@/canvas/world/TriangleButton";

export default function Board({ onPostNext, onPostPrev }) {
  const { scene } = useGLTF("/models/board.glb");
  const myPosition = useUserStore((state) => state.myPosition);
  const boardRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

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
