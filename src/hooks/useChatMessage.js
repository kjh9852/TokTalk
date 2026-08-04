import { useEffect, useState } from "react";

import { useMobileChatStore } from "@/store/mobileChatStore";

export function useChatMessage(socket) {
  const [chatArr, setChatArr] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const isChatOpen = useMobileChatStore((state) => state.isChatOpen);

  useEffect(() => {
    if (!socket) return;

    const handleReceive = (message) => {
      setChatArr((prev) => {
        const recentMessage = [...prev, message];
        return recentMessage.length > 10
          ? recentMessage.slice(-10)
          : recentMessage;
      });

      if (!isChatOpen) {
        setChatCount((count) => Math.min(count + 1, 10));
      }
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [socket, isChatOpen]);
  // 메세지 최대 갯수를 10개만 남김

  useEffect(() => {
    if (isChatOpen) {
      setChatCount(0);
    }
  }, [isChatOpen]);

  return { chatArr, chatCount };
}
