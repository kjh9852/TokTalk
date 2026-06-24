import { useLanguage } from "../../context/LanguageContextProvider";
import Button from "../ui/Button/Button";
import Input from "../ui/Input/Input";
import styles from "./NickNameForm.module.css";

export default function NickNameForm({
  onSubmit,
  defaultValue,
  onChange,
  userName,
  maxLength,
}) {
  const { t } = useLanguage();
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Input
        id="nickname"
        label={t.modal.label.nickname}
        defaultValue={defaultValue}
        placeHolder={t.modal.placeholder.nickname}
        onChange={onChange}
        maxLength={maxLength}
        error={userName.length > 10}
      />
      <div className={styles.formBottom}>
        <Button type="large" disabled={!userName || userName.length > 10}>
          {t.modal.button.nickname}
        </Button>
      </div>
    </form>
  );
}
