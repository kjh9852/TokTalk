import * as THREE from "three";

export default function TriangleButton({ type = "prev", onClick }) {
  const buttonType = {
    prev: {
      rotation: -Math.PI / 2,
      position: [8.2, 1, 4.5],
    },
    next: {
      rotation: Math.PI / 2,
      position: [6.5, 1, 5.5],
    },
  };

  const handleClick = (e) => {
    e.stopPropagation(); // 캔버스까지 이벤트 안 올라가도록
    onClick?.();
  };

  const shape = new THREE.Shape();
  shape.moveTo(0, 1);
  shape.lineTo(-1, -1);
  shape.lineTo(1, -1);
  shape.lineTo(0, 1); // 닫기

  const extrudeSettings = {
    depth: 0.8, // 두께
    bevelEnabled: false, // 모서리 bevel
  };

  return (
    <mesh
      onClick={handleClick}
      onPointerOver={(e) => e.object.material.color.set("orange")}
      onPointerOut={(e) => e.object.material.color.set("lime")}
      scale={[0.15, 0.15, 0.15]}
      position={buttonType[type].position}
      rotation-y={Math.PI / 6}
      rotation-z={buttonType[type].rotation}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial side={THREE.DoubleSide} />
    </mesh>
  );
}
