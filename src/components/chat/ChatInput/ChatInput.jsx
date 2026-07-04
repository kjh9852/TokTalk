import { useEffect, useRef } from "react";

import { useLanguage } from "@/context/LanguageContextProvider";
import { useModalStore } from "@/store/modalStore";

import Button from "@/components/ui/Button/Button";

import styles from "./ChatInput.module.css";

export default function ChatInput({
  userInputMsg,
  onChangeUserMsg,
  onSendMessage,
  setIsChatExpanded,
}) {
  const isOpen = useModalStore((state) => state.isOpen);
  const chatRef = useRef(null);
  const { t } = useLanguage();

  const handleEnterFocus = () => {
    if (isOpen) return;
    if (document.pointerLockElement === null) return;
    chatRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsChatExpanded(true);
      handleEnterFocus();
    }
  };

  const handleSubmit = (e) => {
    onSendMessage(e);
    chatRef.current.blur();
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          ref={chatRef}
          className={styles.input}
          type="text"
          name="text"
          value={userInputMsg}
          onChange={onChangeUserMsg}
          placeholder={t.chat.message}
          disabled={isOpen}
        />
        <Button type="small">{t.chat.button}</Button>
      </form>
    </div>
  );
}
