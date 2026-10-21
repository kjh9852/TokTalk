import { useEffect, useState } from "react";

import { socket } from "@/socket/socket";
import useSocketStatus from "@/socket/useSocketStatus";
import { useModalStore } from "@/store/modalStore";
import { useUserStore } from "@/store/userStore";
import { isMobile } from "@/utils/device";

import CanvasComponent from "@/canvas/CanvasComponent";

import ChattingView from "@/components/chat/ChattingView/ChattingView";
import MobileController from "@/components/mobile/MobileController";
import Modal from "@/components/modal/Modal";
import { LoadingScreen, Menu, UserCount } from "@/components/ui";

import styles from "./Home.module.css";

export default function Home() {
  const isOpen = useModalStore((state) => state.isOpen);
  const openModal = useModalStore((state) => state.openModal);
  const controls = useUserStore((state) => state.controls);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [nickname, setNickname] = useState("익명");
  const { userCount, isSocketConnected } = useSocketStatus(socket);
  const isReady = isModelLoaded && isSocketConnected;

  useEffect(() => {
    if (!isReady) return;

    openModal("guide");
  }, [isReady, openModal]);

  useEffect(() => {
    if (!isOpen || !controls) return;

    controls.unlock();
  }, [isOpen, controls]);

  return (
    <div className={styles.container}>
      <UserCount userCount={userCount} />
      <Menu />
      <ChattingView
        socket={socket}
        nickname={nickname}
      />
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
          nickname={nickname}
          onSetNickName={setNickname}
          defaultValue={nickname}
        />
      )}
    </div>
  );
}
