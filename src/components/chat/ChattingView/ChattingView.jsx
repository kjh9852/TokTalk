import { useCallback, useEffect, useRef, useState } from "react";

import { useMobileChatStore } from "@/store/mobileChatStore";
import { isMobile } from "@/utils/device";

import { useChatMessage } from "@/hooks/useChatMessage";

import ChatCard from "../ChatCard/ChatCard";
import ChatInput from "../ChatInput/ChatInput";
import styles from "./ChattingView.module.css";

export default function ChattingView({ socket, nickname }) {
  const [userInputMsg, setUserInputMsg] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const { chatArr } = useChatMessage(socket);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  const isChatOpen = useMobileChatStore((state) => state.isChatOpen);
  const showChat = !isMobile || isChatOpen;

  const visibleChat = isMobile
    ? isChatOpen
      ? chatArr
      : chatArr.slice(-1)
    : isChatExpanded
      ? chatArr
      : chatArr.slice(-1);

  useEffect(() => {
    if (isMobile) return;
    if (!isChatExpanded) return;

    const timeout = setTimeout(() => {
      setIsChatExpanded(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isChatExpanded]);
  // 5초 뒤에 표시 되는 메세지 1개만 남김

  const sendMessageHandler = useCallback(
    (e) => {
      e.preventDefault();
      if (!nickname.trim() || userInputMsg.trim().length === 0) return;

      socket.emit("send message", {
        message: userInputMsg,
      });

      socket.emit("stopTyping");
      setIsTyping(false);

      setUserInputMsg("");
    },
    [userInputMsg, nickname, socket],
  );

  const changeUserMsg = (e) => {
    setUserInputMsg(e.target.value);

    if (!isTyping) {
      socket.emit("typing");
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping");
      setIsTyping(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section
      className={`${styles.chatSection} ${showChat ? styles.open : styles.close}`}
    >
      <div className={styles.chatView}>
        <ChatCard chatArr={visibleChat} socketId={socket.id} />
        <ChatInput
          userInputMsg={userInputMsg}
          setIsChatExpanded={setIsChatExpanded}
          onChangeUserMsg={changeUserMsg}
          onSendMessage={sendMessageHandler}
        />
      </div>
    </section>
  );
}
