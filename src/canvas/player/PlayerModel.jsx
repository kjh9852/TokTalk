import { useEffect, useMemo } from "react";

import { Billboard, Text, useAnimations, useGLTF } from "@react-three/drei";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

import ChatBubble from "@/canvas/player/ChatBubble";

export default function PlayerModel({ nickname, message, isTyping, isMoving }) {
  const { scene, animations } = useGLTF("/models/pinkbin-optimized.glb");
  const { actions, ref } = useAnimations(animations);

  useEffect(() => {
    if (!actions) return;
    actions.defalut?.play();
  }, [actions]);

  useEffect(() => {
    if (!actions) return;

    if (isMoving) {
      actions.defalut?.stop();
      actions.walk?.reset().fadeIn(0.2).play();
    } else {
      actions.walk?.fadeOut(0.2);
      actions.defalut?.reset().fadeIn(0.2).play();
    }
  }, [isMoving, actions]);

  const cloneScene = useMemo(() => {
    const cloned = clone(scene);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return cloned;
  }, [scene]);

  return (
    <>
      <group ref={ref}>
        <primitive object={cloneScene} />
      </group>
      <Billboard position={[0, 0.7, 0]}>
        <Text
          font="/fonts/Pretendard-Regular.otf"
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="black"
          whiteSpace="normal"
          overflowWrap="break-word"
        >
          {nickname}
        </Text>
      </Billboard>
      {(message || isTyping) && (
        <ChatBubble
          message={message}
          isTyping={isTyping}
        />
      )}
    </>
  );
}

useGLTF.preload("/models/pinkbin-optimized.glb");
