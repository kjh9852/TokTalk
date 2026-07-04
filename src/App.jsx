import { useEffect, useState } from "react";

import { io } from "socket.io-client";

import Main from "./page/Main";

const socket = io.connect("https://toktalkserver.onrender.com");

function App() {
  const [userCount, setUserCount] = useState("");
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
      />
    </div>
  );
}

export default App;
