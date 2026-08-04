import { create } from "zustand";

export const useInteractionStore = create((set) => ({
  interactables: [],

  currentInteractable: null,

  addInteractable: (item) =>
    set((state) => ({
      interactables: [...state.interactables, item],
    })),

  removeInteractable: (id) =>
    set((state) => ({
      interactables: state.interactables.filter((item) => item.id !== id),
    })),

  setInteractable: (item) => set({ currentInteractable: item }),
}));
