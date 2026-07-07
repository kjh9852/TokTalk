import { useEffect, useState } from "react";

import { useLanguage } from "@/context/LanguageContextProvider";
import { useModalStore } from "@/store/modalStore";
import { useProgress } from "@react-three/drei";

import CanvasComponent from "@/canvas/CanvasComponent";

import ChattingView from "@/components/chat/ChattingView/ChattingView";
import LoadingScreen from "@/components/ui/Loading/LoadingScreen";
import Menu from "@/components/ui/Menu/Menu";
import Modal from "@/components/ui/Modal/Modal";

export default function Main({ socket, nickname, setNickname, userCount }) {
  const isOpen = useModalStore((state) => state.isOpen);
  const [isLoaded, setIsLoaded] = useState(false);
  const { progress } = useProgress();
  const { t } = useLanguage();

  useEffect(() => {
    if (progress < 100) return;
    const timeout = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <>
      {!isLoaded ? (
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
          <ChattingView socket={socket} nickname={nickname} />
          <CanvasComponent socket={socket} nickname={nickname} />
          {isOpen && (
            <Modal
              socket={socket}
              onSetNickName={setNickname}
              defaultValue={nickname}
            />
          )}
        </div>
      )}
    </>
  );
}
