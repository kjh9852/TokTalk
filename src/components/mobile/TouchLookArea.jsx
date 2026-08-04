import { useRef } from "react";

import { useMobileControlStore } from "@/store/mobileControlsStore";

export default function TouchLookArea() {
  const lookTouchId = useRef(null);
  const lastTouch = useRef({
    x: 0,
    y: 0,
  });
  const setMobileRotation = useMobileControlStore(
    (state) => state.setMobileRotation,
  );

  const handleTouchStart = (e) => {
    const touch = e.changedTouches[0];

    lookTouchId.current = touch.identifier;

    lastTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchMove = (e) => {
    const touch = [...e.touches].find(
      (t) => t.identifier === lookTouchId.current,
    );

    const deltaX = touch.clientX - lastTouch.current.x;
    const deltaY = touch.clientY - lastTouch.current.y;

    console.log(deltaX, deltaY);

    lastTouch.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    setMobileRotation({
      yaw: -deltaX * 0.009,
      pitch: -deltaY * 0.009,
    });
  };

  const handleTouchEnd = (e) => {
    console.log(e);
  };
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "60%",
        height: "100%",
        touchAction: "none",
      }}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
}
