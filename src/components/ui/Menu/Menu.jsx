import { useRef, useState } from "react";

import { useModalStore } from "@/store/modalStore";

import useLanguage from "@/hooks/useLanguage";

import Icon from "@/components/icons/Icon";

import styles from "./Menu.module.css";

export default function Menu() {
  const { t } = useLanguage();
  const openModal = useModalStore((state) => state.openModal);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleModalOpenWithType = (type) => (e) => {
    e.stopPropagation();

    openModal(type);
  };

  return (
    <div className={styles.buttonPosition}>
      <div className={styles.menuButton}>
        <button
          className={styles.menuFlex}
          onClick={handleMenuOpen}
        >
          <Icon name="menu" />
          <div className={styles.menuName}>
            <span>{t.menuList.menu}</span>
          </div>
        </button>
      </div>
      <div
        ref={menuRef}
        className={`${styles.menuWrapper} ${
          isOpen ? styles.open : styles.close
        }`}
      >
        <ul className={styles.menu}>
          <li className={styles.menuButton}>
            <button
              className={styles.menuFlex}
              onClick={handleModalOpenWithType("nickname")}
            >
              <Icon name="user" />
              <div className={styles.menuName}>
                <span>{t.menuList.nickname}</span>
              </div>
            </button>
          </li>
          <li className={styles.menuButton}>
            <button
              className={styles.menuFlex}
              onClick={handleModalOpenWithType("info")}
            >
              <Icon name="infomation" />
              <div className={styles.menuName}>
                <span>{t.menuList.info}</span>
              </div>
            </button>
          </li>
          <li className={styles.menuButton}>
            <button
              className={styles.menuFlex}
              onClick={handleModalOpenWithType("guide")}
            >
              <Icon name="guide" />
              <div className={styles.menuName}>
                <span>조작 방법</span>
              </div>
            </button>
          </li>
          <li className={styles.menuButton}>
            <button
              className={styles.menuFlex}
              onClick={handleModalOpenWithType("setting")}
            >
              <Icon name="setting" />
              <div className={styles.menuName}>
                <span>{t.menuList.setting}</span>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
