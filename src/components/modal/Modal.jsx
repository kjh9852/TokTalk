import CloseIcon from "@/assets/icons/close.png";
import { useModalStore } from "@/store/modalStore";
import { useUserStore } from "@/store/userStore";

import ModalContent from "@/components/modal/ModalContent/ModalContent";

import styles from "./Modal.module.css";

export default function Modal({ nickname, onSetNickName }) {
  const modalType = useModalStore((state) => state.modalType);
  const closeModal = useModalStore((state) => state.closeModal);

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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <button className={styles.closeButton} onClick={handleModalClose}>
          <img className={styles.closeIcon} src={CloseIcon} alt="닫기" />
        </button>
        <ModalContent
          modalType={modalType}
          nickname={nickname}
          closeForm={closeForm}
          onSetNickName={onSetNickName}
        />
      </div>
    </div>
  );
}
