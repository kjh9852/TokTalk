import styles from "./Button.module.css";

export default function Button({ children, onClick, disabled, type }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button} ${styles[type] ?? ""} ${
        disabled ? styles.disabled : undefined
      }`}
    >
      {children}
    </button>
  );
}
