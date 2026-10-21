import WasdKey from "@/components/guide/WasdKey";
import Key from "@/components/ui/Key/Key";

import styles from "./DesktopGuide.module.css";

export default function DesktopGuide() {
  return (
    <>
      <div className={styles.guideGrid}>
        <div className={styles.guideItem}>
          <span>이동</span>
          <WasdKey />
        </div>
        <div className={styles.guideItem}>
          <span>점프</span>
          <div className={styles.keyArea}>
            <Key wide>SPACE BAR</Key>
          </div>
        </div>
        <div className={styles.guideItem}>
          <span>달리기</span>
          <Key semiWide>SHIFT</Key>
        </div>
        <div className={styles.guideItem}>
          <span>밀치기</span>
          <Key>E</Key>
        </div>
      </div>
    </>
  );
}
