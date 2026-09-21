import useLanguage from "@/hooks/useLanguage";

import NickNameForm from "@/components/form/NickNameForm";
import PostForm from "@/components/form/PostForm";
import InfoContent from "@/components/modal/InfoContent";
import PostEditList from "@/components/post/PostEdit/PostEditList";
import Setting from "@/components/setting/Setting";

import styles from "./ModalContent.module.css";

export default function ModalContent({
  modalType,
  closeForm,
  onSetNickName,
  nickname,
}) {
  const { t } = useLanguage();

  return (
    <>
      {modalType === "nickname" && (
        <>
          <h2 className={styles.modalTitle}>{t.modal.title[modalType]}</h2>
          <NickNameForm
            defaultValue={nickname}
            closeForm={closeForm}
            onSetNickName={onSetNickName}
          />
        </>
      )}
      {modalType === "post" && (
        <>
          <h2 className={styles.modalTitle}>{t.modal.title[modalType]}</h2>
          <PostForm closeForm={closeForm} nickname={nickname} />
        </>
      )}
      {modalType === "postedit" && (
        <>
          <h2 className={`${styles.modalTitle} ${styles.postEditTitle}`}>
            {t.modal.title[modalType]}
          </h2>
          <PostEditList />
        </>
      )}
      {modalType === "info" && (
        <>
          <h2 className={styles.modalTitle}>{t.modal.title[modalType]}</h2>
          <InfoContent />
        </>
      )}
      {modalType === "setting" && (
        <>
          <h2 className={styles.modalTitle}>{t.modal.title[modalType]}</h2>
          <Setting />
        </>
      )}
    </>
  );
}
