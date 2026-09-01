import useLanguage from "@/hooks/useLanguage";

import Button from "@/components/ui/Button/Button";
import TextArea from "@/components/ui/TextArea/TextArea";

import styles from "./NickNameForm.module.css";

export default function PostForm({
  onSubmit,
  defaultValue,
  onChange,
  content,
}) {
  const { t } = useLanguage();
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <TextArea
        id="post"
        label={t.modal.label.post}
        defaultValue={defaultValue}
        onChange={onChange}
        placeHolder={t.modal.placeholder.post}
        error={content.length > 50}
      />
      <div className={styles.formBottom}>
        <Button type="large" disabled={!content || content.length > 50}>
          {t.modal.button.post}
        </Button>
      </div>
    </form>
  );
}
