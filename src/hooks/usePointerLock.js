import { useEffect } from "react";

import { useUserStore } from "@/store/userStore";

export default function usePointerLock() {
  const { isLock, setIsLock } = useUserStore();

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsLock(!!document.pointerLockElement);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () =>
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange,
      );
  }, [setIsLock]);

  return { isLock, setIsLock };
}
