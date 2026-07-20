import { CuboidCollider, RigidBody } from "@react-three/rapier";

export default function Wall() {
  const size = 50;
  const half = size / 2;
  const wallHeight = 5;
  const thickness = 0.5;

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider
        args={[half, wallHeight, thickness]} // 25, 5, 0.5
        position={[0, wallHeight, half + thickness]}
      />
      <CuboidCollider
        args={[half, wallHeight, thickness]}
        position={[0, wallHeight, -half - thickness]}
      />
      <CuboidCollider
        args={[thickness, wallHeight, half]} // 0.5, 5, 25
        position={[-half - thickness, wallHeight, 0]}
      />
      <CuboidCollider
        args={[thickness, wallHeight, half]}
        position={[half + thickness, wallHeight, 0]}
      />
    </RigidBody>
  );
}
