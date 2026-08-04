import { useState } from "react";

import { useLanguage } from "@/context/LanguageContextProvider";
import { useModalStore } from "@/store/modalStore";
import { isMobile } from "@/utils/device";

import CanvasComponent from "@/canvas/CanvasComponent";

import ChattingView from "@/components/chat/ChattingView/ChattingView";
import MobileController from "@/components/mobile/MobileController";
import LoadingScreen from "@/components/ui/Loading/LoadingScreen";
import Menu from "@/components/ui/Menu/Menu";
import Modal from "@/components/ui/Modal/Modal";

export default function Main({
  socket,
  nickname,
  setNickname,
  userCount,
  isSocketConnected,
}) {
  const isOpen = useModalStore((state) => state.isOpen);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const { t } = useLanguage();

  const isReady = isModelLoaded && isSocketConnected;

  return (
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
        <span
          style={{ fontSize: "14px" }}
        >{`${t.userCount} : ${userCount}`}</span>
      </div>
      <Menu />
      <ChattingView socket={socket} nickname={nickname} />
      {!isReady && (
        <LoadingScreen
          isSocektConnected={isSocketConnected}
          isLoaded={isModelLoaded}
        />
      )}
      <CanvasComponent
        socket={socket}
        nickname={nickname}
        onModelLoaded={() => setIsModelLoaded(true)}
      />
      {isMobile && <MobileController socket={socket} />}
      {isOpen && (
        <Modal
          socket={socket}
          onSetNickName={setNickname}
          defaultValue={nickname}
        />
      )}
    </div>
  );
}
