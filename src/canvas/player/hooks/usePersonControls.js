import { useEffect, useState } from "react";

const MAX_PITCH = Math.PI / 2 - 0.1;
const MIN_PITCH = -MAX_PITCH;

const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  KeyE: "push",
  Space: "jump",
  ShiftLeft: "run",
};

export const usePersonControls = () => {
  const moveFieldByKey = (key) => keys[key];
  const isTyping = ["INPUT", "TEXTAREA"].includes(
    document.activeElement?.tagName,
  );
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    run: false,
    push: false,
    yaw: 0,
    pitch: 0,
  });

  const setMovementStatus = (code, status) => {
    if (!code) return;
    setMovement((m) => ({ ...m, [code]: status }));
  };

  useEffect(() => {
    const handleKeyDown = (ev) => {
      if (isTyping) {
        return;
      }
      setMovementStatus(moveFieldByKey(ev.code), true);
    };

    const handleKeyUp = (ev) => {
      if (isTyping) {
        return;
      }
      setMovementStatus(moveFieldByKey(ev.code), false);
    };

    const handleMouseMove = (e) => {
      setMovement((m) => {
        let nextPitch = m.pitch - e.movementY * 0.002;
        nextPitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, nextPitch));
        return {
          ...m,
          yaw: m.yaw - e.movementX * 0.001,
          pitch: nextPitch,
        };
      });
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isTyping]);

  return movement;
};
