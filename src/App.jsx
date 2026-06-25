import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import Main from "./page/Main";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:80"
    : "https://toktalkserver.onrender.com";

const socket = io.connect(SOCKET_URL);

function App() {
  const [userCount, setUserCount] = useState("");
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [nickname, setNickname] = useState("익명");

  useEffect(() => {
    socket.on("playerCount", (count) => {
      setUserCount(count);
    });
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div className="container">
      <Main
        userCount={userCount}
        socket={socket}
        nickname={nickname}
        setNickname={setNickname}
        isPointerLocked={isPointerLocked}
        setIsPointerLocked={setIsPointerLocked}
      />
    </div>
  );
}

export default App;
