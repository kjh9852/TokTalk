import { useEffect, useState } from "react";

import { useLanguage } from "@/context/LanguageContextProvider";
import { useProgress } from "@react-three/drei";

import CanvasComponent from "@/canvas/CanvasComponent";

import ChattingView from "@/components/chat/ChattingView/ChattingView";
import LoadingScreen from "@/components/ui/Loading/LoadingScreen";
import Menu from "@/components/ui/Menu/Menu";
import Modal from "@/components/ui/Modal/Modal";

export default function Main({
  socket,
  nickname,
  setNickname,
  userCount,
  isPointerLocked,
  setIsPointerLocked,
}) {
  const [load, setLoad] = useState(false);
  const { progress } = useProgress();
  const { t } = useLanguage();

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => setLoad(true), 1000);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <>
      {!load ? (
        <LoadingScreen />
      ) : (
        <div style={{ height: "100%" }}>
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              width: "auto",
              zIndex: 99,
            }}
          >
            <span>{`${t.userCount} : ${userCount}`}</span>
          </div>
          <Menu />
          <Modal
            socket={socket}
            onSetNickName={setNickname}
            defaultValue={nickname}
          />
          <ChattingView socket={socket} nickname={nickname} />
          <CanvasComponent
            socket={socket}
            nickname={nickname}
            isPointerLocked={isPointerLocked}
            setIsPointerLocked={setIsPointerLocked}
          />
        </div>
      )}
    </>
  );
}
