import { useLanguage } from "@/context/LanguageContextProvider";
import { Text } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

export default function PostList({ postList, isEditMode }) {
  const { t } = useLanguage();
  return (
    <>
      {postList &&
        postList.map((list, index) => {
          const x = 12 - (index % 3) * 1.7; // 5개마다 줄바꿈
          const y = 3 - Math.floor(index / 3) * 1.2;
          const z = Math.floor(index / 3) * 3;
          return (
            <RigidBody
              type="fixed"
              colliders={false}
              position={[-0.9, 0, 4.05]}
              rotation={[0, Math.PI / 6, 0]}
            >
              <group>
                <Text
                  maxWidth={1.4}
                  lineHeight={1.2}
                  whiteSpace="normal"
                  overflowWrap="break-word"
                  position={[x - 2.8, y + 0.45, 4.98]}
                  rotation={[0, -Math.PI, 0]}
                  fontSize={0.12}
                  color="black"
                  anchorX="left"
                  anchorY="top"
                >
                  {list.content}
                </Text>
                <Text
                  position={[x - 3.5, y - 0.45, 4.98]}
                  rotation={[0, -Math.PI, 0]}
                  fontSize={0.08}
                  color="black"
                  anchorX="center"
                  anchorY="bottom"
                >
                  {`${t.author} : ${list.userName}`}
                </Text>
                <mesh position={[x - 3.5, y, 5]} rotation-x={Math.PI / 2}>
                  <boxGeometry args={[1.5, 0, 1]} />
                  <meshStandardMaterial color="white" />
                </mesh>
              </group>
            </RigidBody>
          );
        })}
    </>
  );
}
