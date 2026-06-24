import { useEffect, useRef } from "react";

import styles from "./Input.module.css";

export default function Input({
  id,
  label,
  defaultValue,
  onChange,
  placeHolder,
  maxLength,
  error,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        ref={inputRef}
        className={styles.input}
        type="text"
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={placeHolder}
        onChange={onChange}
        maxLength={maxLength}
      />
      {error && <p className={styles.error}>10자 이내로 입력해주세요.</p>}
    </div>
  );
}
