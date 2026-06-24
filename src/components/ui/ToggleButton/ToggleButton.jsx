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
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={`${styles.toggle} ${isOn ? styles.on : ""}`}
        onClick={handleToggleEvent}
      >
        <span className={`${styles.label} ${styles.left}`}>{leftLabel}</span>
        <span className={`${styles.label} ${styles.right}`}>{rightLabel}</span>
        <div className={styles.knob}></div>
      </div>
    </div>
  );
}
