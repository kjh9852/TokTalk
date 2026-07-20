import { Physics } from "@react-three/rapier";

export default function PhysicsWorld({ children }) {
  return <Physics gravity={[0, -30, 0]}>{children}</Physics>;
}
