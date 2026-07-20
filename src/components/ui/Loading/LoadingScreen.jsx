import { useProgress } from "@react-three/drei";

import styles from "./LoadingScreen.module.css";

export default function LoadingScreen({ isSocketConnected, isLoaded }) {
  const { progress } = useProgress();
  const percent = progress.toFixed(0);

  let loadingText = "";

  if (!isLoaded) {
    loadingText = "모델링 불러오는중 ...";
  } else if (!isSocketConnected) {
    loadingText = "서버 깨우는중...";
  }

  return (
    <div className={styles.container}>
      <div className={styles.loadingContainer}>
        <progress className="progress" max="100" value={percent} />
        <span className={styles.percentText}>{percent}%</span>
        {loadingText && (
          <span className={styles.loadingText}>{loadingText}</span>
        )}
      </div>
    </div>
  );
}
