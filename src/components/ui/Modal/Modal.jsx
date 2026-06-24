import { useState } from "react";

import CloseIcon from "@/assets/icons/close.png";
import { useLanguage } from "@/context/LanguageContextProvider";
import { useModalContext } from "@/context/ModalContextProvider";
import { usePosts } from "@/context/PostContext";
import { useUserContext } from "@/context/UserContextProvider";

import NickNameForm from "@/components/form/NickNameForm";
import PostForm from "@/components/form/PostForm";
import PostEditList from "@/components/post/PostEdit/PostEditList";
import Setting from "@/components/setting/Setting";

import styles from "./Modal.module.css";

export default function Modal({ socket, onSetNickName, defaultValue }) {
  const { t } = useLanguage();
  const { addPost } = usePosts();
  const { isOpen, modalType, handleModalClose } = useModalContext();
  const { controlsRef } = useUserContext();
  const [userName, setUserName] = useState(defaultValue);
  const [content, setContent] = useState("");

  const canvas = document.getElementById("canvas");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFormClose = (e) => {
    e.preventDefault();
    handleModalClose();
    console.log(document.pointerLockElement === null);
    requestAnimationFrame(() => {
      controlsRef.current?.lock();
    });
  };

  const updateNicknameState = () => {
    onSetNickName(userName);
  };

  const emitNicknameToSocket = (nickname) => {
    socket.emit("nicknameUpdate", { nickname });
  };

  const submitPost = (content, userName) => {
    addPost(content, userName);
  };

  const handleNicknameSubmit = (e) => {
    console.log("닉네임 변경");
    handleFormClose(e);
    updateNicknameState();
    emitNicknameToSocket(userName);
  };

  const handlePostSubmit = (e) => {
    handleFormClose(e);
    submitPost(content, userName);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("엔터감지");
      controlsRef.current?.lock();
    }
  };

  return (
    <>
      {isOpen && (
        <div className={styles.container}>
          <div className={styles.title}>
            <button className={styles.close} onClick={handleModalClose}>
              <img className={styles.closeIcon} src={CloseIcon} alt="닫기" />
            </button>
            {modalType !== "copyright" && (
              <h2 className={styles.modalTitle}>{t.modal.title[modalType]}</h2>
            )}
          </div>

          {modalType === "nickname" && (
            <NickNameForm
              onSubmit={handleNicknameSubmit}
              defaultValue={defaultValue}
              onChange={handleUserNameChange}
              userName={userName}
            />
          )}
          {modalType === "post" && (
            <PostForm
              onSubmit={handlePostSubmit}
              content={content}
              onChange={handleContentChange}
            />
          )}
          {modalType === "postedit" && <PostEditList />}
          {modalType === "info" && (
            <div>
              <p
                style={{
                  paddingBottom: "18px",
                  fontSize: "14px",
                  fontWeight: "300",
                  color: "#000",
                }}
              >
                © NEXON Korea Corporation. All Rights Reserved. <br />
                Modeling by 김정현. (Fan-made, non-commercial)
              </p>
            </div>
          )}
          {modalType === "setting" && <Setting socket={socket} />}
        </div>
      )}
    </>
  );
}
