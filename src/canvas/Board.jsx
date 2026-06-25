import { useEffect, useRef } from "react";

import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import TriangleButton from "@/canvas/TriangleButton";

export default function Board({ onPostNext, onPostPrev }) {
  const { scene } = useGLTF("/models/boardbake.glb");
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
      <RigidBody
        type="fixed"
        ref={boardRef}
        position={[12.93, 0, 1.93]}
        rotation={[0, -Math.PI / 3, 0]}
      >
        <group>
          <primitive object={scene} scale={[-0.13, 0.13, 0.16]} />
        </group>
      </RigidBody>
      <TriangleButton onClick={onPostPrev} />
      <TriangleButton onClick={onPostNext} type="next" />
    </>
  );
}

useGLTF.preload("/models/boardbake.glb");
