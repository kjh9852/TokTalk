import { useEffect, useState } from "react";

export default function useSocketStatus(socket) {
  const [userCount, setUserCount] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    setIsSocketConnected(socket.connected);

    const handleConnect = () => {
      setIsSocketConnected(true);
    };
    const handleDisConnect = () => {
      setIsSocketConnected(false);
    };
    const handlePlayerCount = (count) => {
      setUserCount(count);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisConnect);
    socket.on("playerCount", handlePlayerCount);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisConnect);
      socket.off("playerCount", handlePlayerCount);
    };
  }, [socket]);

  return { userCount, isSocketConnected };
}
