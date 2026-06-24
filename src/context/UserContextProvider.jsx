import { createContext, useContext, useRef, useState } from "react";

const initialValue = {
  isLock: true,
  controlsRef: null,
  setIsLock: () => {},
};

export const UserContext = createContext(initialValue);

export default function UserProvider({ children }) {
  const controlsRef = useRef(null);
  const [isLock, setIsLock] = useState(true);

  const userValue = {
    isLock: isLock,
    controlsRef,
    setIsLock,
  };

  return (
    <UserContext.Provider value={userValue}>{children}</UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
