import { useState } from "react";

import { socket } from "@/socket/socket";

import useLanguage from "@/hooks/useLanguage";

import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import styles from "./NickNameForm.module.css";

export default function NickNameForm({
  closeForm,
  defaultValue,
  maxLength,
  onSetNickName,
}) {
  const { t } = useLanguage();
  const [userName, setUserName] = useState(defaultValue);

  const updateNicknameState = () => {
    onSetNickName(userName);
  };

  const handleNicknameSubmit = (e) => {
    e.preventDefault();

    updateNicknameState();
    emitNicknameToSocket(userName);

    closeForm();
  };

  const emitNicknameToSocket = (nickname) => {
    socket.emit("nicknameUpdate", { nickname });
  };
  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  return (
    <form className={styles.form} onSubmit={handleNicknameSubmit}>
      <Input
        id="nickname"
        label={t.modal.label.nickname}
        defaultValue={defaultValue}
        placeHolder={t.modal.placeholder.nickname}
        onChange={handleUserNameChange}
        maxLength={maxLength}
        error={userName.length > 10}
      />
      <div className={styles.formBottom}>
        <Button type="large" disabled={!userName || userName.length > 10}>
          {t.modal.button.nickname}
        </Button>
      </div>
    </form>
  );
}
