import { getBoardPostPosition } from "@/utils/getBoardPostPosition";
import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

import useLanguage from "@/hooks/useLanguage";

export default function PostItem({ post, index }) {
  const { t } = useLanguage();
  const { x, y } = getBoardPostPosition(index);

  return (
    <RigidBody type="fixed" colliders={false}>
      <group position={[x, y, 3.9]}>
        <Text
          font="/fonts/Pretendard-Regular.otf"
          maxWidth={1.4}
          lineHeight={1.2}
          whiteSpace="normal"
          overflowWrap="break-word"
          position={[0.7, 0.45, -0.005]}
          rotation={[0, -Math.PI, 0]}
          fontSize={0.12}
          color="black"
          anchorX="left"
          anchorY="top"
        >
          {post.content}
        </Text>
        <Text
          font="/fonts/Pretendard-Regular.otf"
          position={[0, -0.45, -0.005]}
          rotation={[0, -Math.PI, 0]}
          fontSize={0.08}
          color="black"
          anchorX="center"
          anchorY="bottom"
        >
          {`${t.author} : ${post.userName}`}
        </Text>
        <mesh rotation-x={Math.PI / 2}>
          <boxGeometry args={[1.6, 0, 1]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </RigidBody>
  );
}
