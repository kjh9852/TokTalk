import floorTexture from "@/assets/images/grid02.png";
import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Ground() {
  const texture = useTexture(floorTexture);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <RigidBody type="fixed" colliders={false}>
      <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="gray"
          map={texture}
          map-repeat={[15, 15]}
        />
      </mesh>
      <CuboidCollider args={[25, 2, 25]} position={[0, -2, 0]} />
    </RigidBody>
  );
}
