import styles from "./Key.module.css";

export default function Key({ children, wide = false, semiWide = false }) {
  return (
    <kbd
      className={`${styles.key} ${wide ? styles.wide : ""} ${semiWide ? styles.semiWide : ""}`}
    >
      {children}
    </kbd>
  );
}
