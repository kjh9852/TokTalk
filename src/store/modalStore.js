import { create } from "zustand";

export const useModalStore = create((set) => ({
  isOpen: false,
  modalType: null,

  openModal: (type) => set({ isOpen: true, modalType: type }),

  closeModal: () => set({ isOpen: false, modalType: null }),
}));
