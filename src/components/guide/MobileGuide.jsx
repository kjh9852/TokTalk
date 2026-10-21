import pushIcon from "@/assets/icons/attack.png";
import jumpIcon from "@/assets/icons/jump.png";
import runIcon from "@/assets/icons/run.png";
import { Joystick } from "react-joystick-component";

import styles from "./MobileGuide.module.css";

export default function MobileGuide() {
  return (
    <>
      <div className={styles.mobileGuideGrid}>
        <div className={styles.mobileGuideItem}>
          <span>이동</span>
          <div className={styles.mobileGuideImage}>
            <Joystick
              size={60}
              sticky={false}
              baseColor="#e2e2e2"
              stickColor="#919191"
            />
          </div>
        </div>
        <div className={styles.mobileGuideItem}>
          <span>점프</span>
          <div className={styles.mobileGuideImage}>
            <img src={jumpIcon} />
          </div>
        </div>
        <div className={styles.mobileGuideItem}>
          <span>달리기</span>
          <div className={`${styles.mobileGuideImage} ${styles.run}`}>
            <img src={runIcon} />
          </div>
        </div>
        <div className={styles.mobileGuideItem}>
          <span>밀치기</span>
          <div className={`${styles.mobileGuideImage} ${styles.atk}`}>
            <img src={pushIcon} />
          </div>
        </div>
        <div className={styles.mobileGuideItem}>
          <span>상호작용</span>
          <div className={styles.mobileGuideImage}>
            <span>액션</span>
          </div>
        </div>
      </div>
    </>
  );
}
