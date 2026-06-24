import { useCallback, useEffect, useRef, useState } from "react";

import ChatCard from "../ChatCard/ChatCard";
import ChatInput from "../ChatInput/ChatInput";
import styles from "./ChattingView.module.css";

export default function ChattingView({ socket, nickname }) {
  const [userInputMsg, setUserInputMsg] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [chatArr, setChatArr] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!isChatExpanded) return;

    const timeout = setTimeout(() => {
      setIsChatExpanded(false);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isChatExpanded]);
  // 5초 뒤에 표시 되는 메세지 1개만 남김

  useEffect(() => {
    if (!socket) return;
    const handleReceive = (message) => {
      setChatArr((prev) => {
        const recentMessage = [...prev, message];
        return recentMessage.length > 10
          ? recentMessage.slice(-10)
          : recentMessage;
      });
    };
    socket.on("receive message", handleReceive);

    return () => {
      socket.off("receive message", handleReceive);
    };
  }, [socket]);
  // 메세지 최대 갯수를 10개만 남김

  const sendMessageHandler = useCallback(
    (e) => {
      e.preventDefault();
      if (!nickname.trim()) return; // 닉네임 없으면 중단
      socket.emit("send message", {
        message: userInputMsg,
      });
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

  return (
    <section className={styles.chatSection}>
      <div className={styles.chatView}>
        <ChatCard
          chatArr={isChatExpanded ? chatArr : chatArr.slice(-1)}
          isChatExpanded={isChatExpanded}
          socketId={socket.id}
        />
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
