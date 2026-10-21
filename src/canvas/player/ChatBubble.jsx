import { useRef, useState } from "react";

import { Billboard, RoundedBox, Text } from "@react-three/drei";

export default function ChatBubble({ message, isTyping }) {
  const chatRef = useRef(null);
  const [chatBoxSize, setChatBoxSize] = useState([0, 0]);
  const chatPaddingX = 0.5;
  const chatPaddingY = 0.1;

  const textContent =
    isTyping && !message
      ? "..."
      : message.length > 20
        ? `${message.slice(0, 20)} ...`
        : message;

  const handleTextSync = (self) => {
    const bounds = self.textRenderInfo?.blockBounds;

    if (!bounds) return;

    const [minX, minY, maxX, maxY] = bounds;

    const width = maxX - minX;
    const height = maxY - minY;

    setChatBoxSize([width, height]);
  };

  return (
    <Billboard position={[0, 1, 0]}>
      <RoundedBox
        position={[0, chatBoxSize[1] / 2, -0.01]}
        args={[
          Math.max(chatBoxSize[0] + chatPaddingX, 0.4),
          Math.max(chatBoxSize[1] + chatPaddingY, 0.3),
          0.01,
        ]}
        radius={0.05}
        smoothness={4}
      >
        <meshBasicMaterial
          color="black"
          transparent
          opacity={0.7}
        />
      </RoundedBox>
      <Text
        font="/fonts/Pretendard-Regular.otf"
        ref={chatRef}
        fontSize={0.15}
        maxWidth={1.5}
        lineHeight={1.2}
        whiteSpace="normal"
        overflowWrap="break-word"
        color="white"
        anchorX="center"
        anchorY="bottom"
        onSync={handleTextSync}
      >
        {textContent}
      </Text>
    </Billboard>
  );
}
