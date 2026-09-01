import { useMobileControlStore } from "@/store/mobileControlsStore";

import styles from "./MobileButton.module.css";

export default function MobileButton({ type, icon }) {
  const isPressed = useMobileControlStore((state) => state.mobileAction[type]);

  const setMobileAction = useMobileControlStore(
    (state) => state.setMobileAction,
  );

  return (
    <button
      className={`${styles.mobileButton} ${styles[type]} ${isPressed ? styles.active : ""}`}
      onTouchStart={() => setMobileAction({ [type]: true })}
      onTouchEnd={() => setMobileAction({ [type]: false })}
      onTouchCancel={() => setMobileAction({ [type]: false })}
    >
      <img src={icon} alt={type} />
    </button>
  );
}
