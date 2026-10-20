import { useState } from "react";

import styles from "./ToggleButton.module.css";

export default function ToggleButton({
  title,
  leftLabel,
  rightLabel,
  onClick,
  isToggleOn,
}) {
  const [isOn, setIsOn] = useState(isToggleOn);

  const handleToggleEvent = (e) => {
    e.stopPropagation();
    setIsOn((prev) => !prev);
    onClick();
  };

  return (
    <div>
      <p className={styles.settingLabel}>{title}</p>
      <div
        className={`${styles.toggle} ${isOn ? styles.on : ""}`}
        onClick={handleToggleEvent}
      >
        <span className={`${styles.option} ${styles.left}`}>{leftLabel}</span>
        <span className={`${styles.option} ${styles.right}`}>{rightLabel}</span>
        <div className={styles.knob}></div>
      </div>
    </div>
  );
}
