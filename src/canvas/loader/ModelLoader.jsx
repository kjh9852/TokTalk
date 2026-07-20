import { useEffect } from "react";

import { useProgress } from "@react-three/drei";

export default function ModelLoader({ onLoaded }) {
  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      onLoaded();
    }
  }, [progress, onLoaded]);

  return null;
}
