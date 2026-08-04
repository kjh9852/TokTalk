import mobileChatIcon from "@/assets/icons/message.png";
import { useMobileChatStore } from "@/store/mobileChatStore";

import { useChatMessage } from "@/hooks/useChatMessage";

import styles from "./MobileChat.module.css";

export default function MobileChat({ socket }) {
  const toggleChat = useMobileChatStore((state) => state.toggleChat);
  const { chatCount } = useChatMessage(socket);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatAlign}>
        <button onClick={toggleChat}>
          <img
            className={styles.chatIcon}
            src={mobileChatIcon}
            alt="채팅아이콘"
          />
        </button>
      </div>
      {chatCount >= 1 && <span className={styles.chatCount}>{chatCount}</span>}
    </div>
  );
}
