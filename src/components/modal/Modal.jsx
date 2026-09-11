import CloseIcon from "@/assets/icons/close.png";
import { useModalStore } from "@/store/modalStore";
import { useUserStore } from "@/store/userStore";

import useLanguage from "@/hooks/useLanguage";

import ModalContent from "@/components/modal/ModalContent/ModalContent";

import styles from "./Modal.module.css";

export default function Modal({ nickname, onSetNickName }) {
  const { t } = useLanguage();
  const closeModal = useModalStore((state) => state.closeModal);
  const modalType = useModalStore((state) => state.modalType);
  const controls = useUserStore((state) => state.controls);

  const handleModalClose = () => {
    closeModal();
    controls?.lock();
  };

  const closeForm = () => {
    closeModal();
    controls?.lock();
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <button className={styles.close} onClick={handleModalClose}>
            <img className={styles.closeIcon} src={CloseIcon} alt="닫기" />
          </button>
          <h2 className={styles.modalTitle}>{t.modal.title[modalType]}</h2>
        </div>
        <ModalContent
          nickname={nickname}
          closeForm={closeForm}
          onSetNickName={onSetNickName}
        />
      </div>
    </>
  );
}
