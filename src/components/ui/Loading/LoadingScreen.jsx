import { useProgress } from "@react-three/drei";

import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  const { progress } = useProgress();

  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <progress className="progress" max="100" value={progress.toFixed(0)} />
        <span className={styles.loadingText}>{progress.toFixed(0)}%</span>
      </div>
    </div>
  );
}
