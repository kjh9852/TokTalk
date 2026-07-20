import { useGLTF } from "@react-three/drei";

export default function Yeti() {
  const { nodes } = useGLTF("/models/yeti.glb");

  return (
    <group dispose={null} scale={1}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={nodes.Cube004.material}
        scale={3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004_1.geometry}
        material={nodes.Cube004_1.material}
        scale={3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004_2.geometry}
        material={nodes.Cube004_2.material}
        scale={3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004_3.geometry}
        material={nodes.Cube004_1.material}
        scale={3}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004_4.geometry}
        material={nodes.Cube004_4.material}
        scale={3}
      />
    </group>
  );
}

useGLTF.preload("/models/yeti.glb");
