import { useCallback, useEffect, useRef } from "react";

import submitIcon from "@/assets/icons/submit.png";
import { useModalStore } from "@/store/modalStore";
import { isMobile } from "@/utils/device";

import useLanguage from "@/hooks/useLanguage";

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

  const handleEnterFocus = useCallback(() => {
    if (isOpen) return;
    if (document.pointerLockElement === null) return;
    chatRef.current.focus();
  }, [isOpen]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key !== "Enter") return;
      if (document.activeElement === chatRef.current) return;
      e.preventDefault();
      setIsChatExpanded(true);
      handleEnterFocus();
    },
    [handleEnterFocus, setIsChatExpanded],
  );

  const handleSubmit = (e) => {
    onSendMessage(e);
    chatRef.current.blur();
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

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
        <Button type={isMobile ? "mobile" : "small"}>
          {!isMobile ? (
            t.chat.button
          ) : (
            <img
              style={{ width: "20px", height: "20px" }}
              src={submitIcon}
              alt="전송"
            />
          )}
        </Button>
      </form>
    </div>
  );
}
