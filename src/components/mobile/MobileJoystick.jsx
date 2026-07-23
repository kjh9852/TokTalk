import { mobileControlStore } from "@/store/mobileControlsStore";
import { Joystick } from "react-joystick-component";

export default function MobileJoystick() {
  const setMobileMove = mobileControlStore((state) => state.setMobileMove);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        left: "20px",
        zIndex: "9999",
      }}
    >
      <Joystick
        move={(event) => {
          const x = event.x;
          const y = event.y;

          setMobileMove({
            forward: y > 0.2,
            backward: y < -0.2,
            left: x < -0.2,
            right: x > 0.2,
          });
        }}
        stop={() => {
          setMobileMove({
            forward: false,
            backward: false,
            left: false,
            right: false,
          });
        }}
        size={100}
        sticky={true}
        baseColor="#e2e2e2"
        stickColor="#919191"
      />
    </div>
  );
}
