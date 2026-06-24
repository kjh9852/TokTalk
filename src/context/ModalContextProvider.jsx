import { createContext, useContext, useState } from "react";

const initialValue = {
  isOpen: false,
  modalType: "nickname",
  setModalType: () => {},
  handleModalOpen: () => {},
  handleModalClose: () => {},
};

export const ModalContext = createContext(initialValue);

export default function ModalProvider({ children }) {
  const [modalType, setModalType] = useState("nickname");
  const [isOpen, setIsOpen] = useState(false);

  const handleModalOpen = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
    setModalType("");
  };

  const modalValue = {
    isOpen,
    modalType,
    setModalType,
    handleModalOpen,
    handleModalClose,
  };

  return (
    <ModalContext.Provider value={modalValue}>{children}</ModalContext.Provider>
  );
}

export const useModalContext = () => useContext(ModalContext);
