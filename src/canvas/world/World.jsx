import { Sky } from "@react-three/drei";

const shadowOffset = 50;

export default function World() {
  return (
    <>
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
    </>
  );
}
