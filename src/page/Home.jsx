import { useState } from "react";

import { socket } from "@/socket/socket";
import useSocketStatus from "@/socket/useSocketStatus";
import { useModalStore } from "@/store/modalStore";
import { isMobile } from "@/utils/device";

import CanvasComponent from "@/canvas/CanvasComponent";

import ChattingView from "@/components/chat/ChattingView/ChattingView";
import MobileController from "@/components/mobile/MobileController";
import { LoadingScreen, Menu, Modal, UserCount } from "@/components/ui";

import styles from "./Home.module.css";

export default function Home() {
  const isOpen = useModalStore((state) => state.isOpen);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [nickname, setNickname] = useState("익명");
  const { userCount, isSocketConnected } = useSocketStatus(socket);
  const isReady = isModelLoaded && isSocketConnected;

  return (
    <div className={styles.container}>
      <UserCount userCount={userCount} />
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
