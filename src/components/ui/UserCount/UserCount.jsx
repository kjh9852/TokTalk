import { useLanguage } from "@/context/LanguageContextProvider";

import styles from "./UserCount.module.css";

export default function UserCount({ userCount }) {
  const { t } = useLanguage();

  return (
    <div className={styles.userCount}>
      <span>{`${t.userCount} : ${userCount}`}</span>
    </div>
  );
}
