import { useState } from "react";

import { io } from "socket.io-client";

import useSocketStatus from "@/hooks/useSocketStatus";

import Main from "./page/Main";

const socket = io(import.meta.env.VITE_SOCKET_URL);

function App() {
  const { userCount, isSocketConnected } = useSocketStatus(socket);
  const [nickname, setNickname] = useState("익명");

  return (
    <div className="container">
      <Main
        isSocketConnected={isSocketConnected}
        userCount={userCount}
        socket={socket}
        nickname={nickname}
        setNickname={setNickname}
      />
    </div>
  );
}

export default App;
