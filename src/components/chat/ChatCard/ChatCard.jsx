import { useEffect, useRef } from "react";

import styles from "./ChatCard.module.css";

export default function ChatCard({ chatArr, isChatExpanded, socketId }) {
  const chatRef = useRef(null);

  useEffect(() => {
    const chatBox = chatRef.current;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, [chatArr]);

  return (
    <div className={styles.container} ref={chatRef}>
      {chatArr.map((messageCount, idx) => (
        <p
          className={`${styles.chat} ${
            messageCount.id === socketId && styles.localColor
          }`}
          key={`${messageCount.id} - ${messageCount.time} - ${idx}`}
        >{`${messageCount.author} : ${messageCount.message}`}</p>
      ))}
    </div>
  );
}
