import { create } from "zustand";

const MAX_PITCH = Math.PI / 2 - 0.1;
const MIN_PITCH = -MAX_PITCH;

export const mobileControlStore = create((set) => ({
  mobileMove: {
    forward: false,
    backward: false,
    left: false,
    right: false,
  },

  mobileLook: {
    yaw: 0,
    pitch: 0,
  },

  setMobileMove: (movement) => {
    set({ mobileMove: movement });
  },

  setMobileRotation: ({ yaw, pitch }) => {
    set((state) => ({
      mobileLook: {
        yaw: state.mobileLook.yaw + yaw,
        pitch: Math.max(
          MIN_PITCH,
          Math.min(MAX_PITCH, state.mobileLook.pitch + pitch),
        ),
      },
    }));
  },
}));
