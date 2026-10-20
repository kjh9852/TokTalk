import ChatIcon from "@/assets/icons/message.svg?react";
import { useMobileChatStore } from "@/store/mobileChatStore";

import { useChatMessage } from "@/hooks/useChatMessage";

import styles from "./MobileChat.module.css";

export default function MobileChat({ socket }) {
  const toggleChat = useMobileChatStore((state) => state.toggleChat);
  const { chatCount } = useChatMessage(socket);

  return (
    <div className={styles.chatContainer}>
      <button
        className={styles.chatButton}
        onClick={toggleChat}
      >
        <ChatIcon className={styles.chatIcon} />
      </button>
      {chatCount >= 1 && (
        <span className={styles.chatCount}>
          {chatCount > 10 ? "10+" : chatCount}
        </span>
      )}
    </div>
  );
}
