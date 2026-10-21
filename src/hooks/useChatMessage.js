import { useEffect, useState } from "react";

import { useMobileChatStore } from "@/store/mobileChatStore";

export function useChatMessage(socket) {
  const [chatArr, setChatArr] = useState([]);
  const [chatCount, setChatCount] = useState(0);
  const isChatOpen = useMobileChatStore((state) => state.isChatOpen);

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      setChatArr((prev) => {
        const recentMessage = [...prev, message];
        return recentMessage.length > 10
          ? recentMessage.slice(-10)
          : recentMessage;
      });

      if (!isChatOpen) {
        setChatCount((count) => Math.min(count + 1, 11));
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
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
