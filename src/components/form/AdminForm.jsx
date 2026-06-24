import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import styles from "./NickNameForm.module.css";

export default function AdminForm({
  onSubmit,
  defaultValue,
  onChange,
  maxLength,
  isAdmin,
}) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        id="nickname"
        defaultValue={defaultValue}
        placeHolder="Admin Key"
        onChange={onChange}
        maxLength={maxLength}
      />
      <Button disabled={isAdmin}>
        {!isAdmin ? "확인" : "이미 활성화 되어 있습니다."}
      </Button>
    </form>
  );
}
