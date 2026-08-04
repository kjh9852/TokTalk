import { create } from "zustand";

export const useMobileChatStore = create((set) => ({
  isChatOpen: false,

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
}));
