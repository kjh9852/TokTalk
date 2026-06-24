import { useEffect, useRef } from "react";

import styles from "./TextArea.module.css";

export default function TextArea({
  id,
  label,
  defaultValue,
  placeHolder,
  onChange,
  error,
}) {
  const textRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  useEffect(() => {
    textRef.current.focus();
  }, []);

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={textRef}
        className={styles.textArea}
        type="text"
        maxLength="1200"
        id={id}
        name={id}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        onChange={onChange}
        onKeyDown={handleKeyPress}
      />
      {error && <p className={styles.error}>50자 이내로 입력해주세요.</p>}
    </div>
  );
}
