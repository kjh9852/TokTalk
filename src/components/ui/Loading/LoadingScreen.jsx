import { useProgress } from "@react-three/drei";

import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  const { progress } = useProgress();
  const percent = progress.toFixed(0);

  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <progress className="progress" max="100" value={percent} />
        <span className={styles.loadingText}>{percent}%</span>
      </div>
    </div>
  );
}
