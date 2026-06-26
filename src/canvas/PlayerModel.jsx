import { useEffect, useMemo, useRef, useState } from "react";

import {
  Billboard,
  RoundedBox,
  Text,
  useAnimations,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";

export default function PlayerModel({ nickname, message, isTyping, isMoving }) {
  const { scene, animations } = useGLTF("/models/pinkbin.glb");
  const { actions, ref } = useAnimations(animations);
  const chatRef = useRef();
  const [chatBoxSize, setChatBoxSize] = useState([0, 0]);

  const textContent = isTyping && !message ? "..." : message;
  const DEFAULT_CHATBOX_SIZE = [0.05, 0.15];

  useEffect(() => {
    if (!chatRef.current || !message) {
      setChatBoxSize(DEFAULT_CHATBOX_SIZE);
      return;
    }

    const interval = setInterval(() => {
      const box = new THREE.Box3().setFromObject(chatRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);

      if (size.x > 0 && size.y > 0) {
        setChatBoxSize([size.x, size.y]);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [message]);

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
    <group ref={ref}>
      <primitive object={cloneScene} />
      <Billboard position={[0, 0.7, 0]}>
        <Text
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
        <Billboard position={[0, 1, 0]}>
          <RoundedBox
            position={[0, chatBoxSize[1] / 2 - 0.01, -0.01]}
            args={[chatBoxSize[0] + 0.5, chatBoxSize[1] + 0.05, 0.01]} // x, y, z 크기
            radius={0.05} // 모서리 반지름
            smoothness={4} // 곡률 부드럽기
          >
            <meshBasicMaterial color="black" transparent opacity={0.7} />
          </RoundedBox>
          <Text
            ref={chatRef}
            fontSize={0.15}
            maxWidth={1.5}
            lineHeight={1.2}
            whiteSpace="normal"
            overflowWrap="break-word"
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {textContent}
          </Text>
        </Billboard>
      )}
    </group>
  );
}
