import { create } from "zustand";

export const useUserStore = create((set) => ({
  isLock: true,
  controls: null,
  playerRef: null,
  myPosition: { x: 0, y: 0, z: 0 },

  setIsLock: (bool) =>
    set({
      isLock: bool,
    }),

  setControls: (instance) =>
    set({
      controls: instance,
    }),

  setPlayerRef: (instance) =>
    set({
      playerRef: instance,
    }),

  setMyPosition: (position) =>
    set({
      myPosition: position,
    }),
}));
