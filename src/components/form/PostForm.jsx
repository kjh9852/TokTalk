import { useState } from "react";

import { useAddPost } from "@/queries/useAddPost";

import useLanguage from "@/hooks/useLanguage";

import { Loading } from "@/components/ui";
import Button from "@/components/ui/Button/Button";
import TextArea from "@/components/ui/TextArea/TextArea";

import styles from "./NickNameForm.module.css";

export default function PostForm({ closeForm, nickname }) {
  const { t } = useLanguage();
  const { mutate: addPost, isPending } = useAddPost();
  const [content, setContent] = useState("");

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();

    addPost(
      { content, userName: nickname },
      {
        onSuccess: () => {
          closeForm();
        },
      },
    );
  };

  return (
    <form className={styles.form} onSubmit={handlePostSubmit}>
      <TextArea
        id="post"
        label={t.modal.label.post}
        onChange={handleContentChange}
        placeHolder={t.modal.placeholder.post}
        error={content.length > 50}
      />
      <div className={styles.formBottom}>
        <Button
          type="large"
          disabled={!content || content.length > 50 || isPending}
        >
          {isPending ? <Loading /> : t.modal.button.post}
        </Button>
      </div>
    </form>
  );
}
