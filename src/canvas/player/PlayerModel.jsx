import { useEffect, useMemo } from "react";

import { Billboard, Text, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

import ChatBubble from "@/canvas/player/ChatBubble";

const HEAD_OFFSET = -0.1;

const MAX_HEAD_ROTATION = 0.3;

const MAX_PITCH = Math.PI / 2 - 0.1;
const MIN_PITCH = -MAX_PITCH;

const PITCH_THRESHOLD = 0.6;

export default function PlayerModel({
  nickname,
  message,
  isTyping,
  isMoving,
  headPitch = 0,
}) {
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

  const headBone = useMemo(() => {
    return cloneScene.getObjectByName("head");
  }, [cloneScene]);

  useFrame((_, delta) => {
    if (!headBone) return;

    let targetRotation = HEAD_OFFSET;

    if (headPitch >= MAX_PITCH - PITCH_THRESHOLD) {
      targetRotation = HEAD_OFFSET - MAX_HEAD_ROTATION;
    } else if (headPitch <= MIN_PITCH + PITCH_THRESHOLD) {
      targetRotation = HEAD_OFFSET + MAX_HEAD_ROTATION;
    }

    headBone.rotation.x = THREE.MathUtils.lerp(
      headBone.rotation.x,
      targetRotation,
      1 - Math.exp(-10 * delta),
    );
  });

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
