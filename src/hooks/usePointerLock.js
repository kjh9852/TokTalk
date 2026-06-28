import { useEffect } from "react";

import { useUserContext } from "../context/UserContextProvider";

export default function usePointerLock() {
  const { isLock, setIsLock } = useUserContext();

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
