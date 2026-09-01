import { useState } from "react";

import InfomationIcon from "@/assets/icons/infomation.png";
import MenuIcon from "@/assets/icons/menu.png";
import SettingIcon from "@/assets/icons/setting.png";
import UserIcon from "@/assets/icons/user.png";
import { useModalStore } from "@/store/modalStore";

import useLanguage from "@/hooks/useLanguage";

import styles from "./Menu.module.css";

export default function Menu() {
  const { t } = useLanguage();
  const openModal = useModalStore((state) => state.openModal);
  const [isOpen, setIsOpen] = useState(false);

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
        <button className={styles.menuFlex} onClick={handleMenuOpen}>
          <img src={MenuIcon} className={styles.menuImage} />
          <div className={styles.menuName}>
            <span>{t.menuList.menu}</span>
          </div>
        </button>
      </div>
      <div
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
              <img src={UserIcon} className={styles.menuImage} />
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
              <img src={InfomationIcon} className={styles.menuImage} />
              <div className={styles.menuName}>
                <span>{t.menuList.info}</span>
              </div>
            </button>
          </li>
          <li className={styles.menuButton}>
            <button
              className={styles.menuFlex}
              onClick={handleModalOpenWithType("setting")}
            >
              <img src={SettingIcon} className={styles.menuImage} />
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
