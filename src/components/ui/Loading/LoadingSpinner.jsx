import { useRef } from "react";

import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function LoadingSpinner() {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.3;
    }
  });

  return (
    <group position={[8, 2.3, 3.904]}>
      <mesh ref={meshRef}>
        <ringGeometry args={[0.15, 0.2, 64, 1, 0, Math.PI * 1.5]} />
        <meshBasicMaterial side={THREE.DoubleSide} color="lime" />
      </mesh>
    </group>
  );
}
