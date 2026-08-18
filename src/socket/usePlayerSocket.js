import { useEffect, useRef, useState } from "react";

export default function usePlayerSocket(socket) {
  const [players, setPlayers] = useState({});
  const messageTimer = useRef({});

  useEffect(() => {
    if (!socket) return;

    const updatePlayer = (id, data) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          ...data,
        },
      }));
    };

    const handleCurrentPlayers = (currentPlayers) => {
      setPlayers(currentPlayers);
    };

    const handlePlayerStatus = ({ id, state }) => {
      setPlayers((prev) => ({ ...prev, [id]: state }));
    };

    const handleNicknameUpdate = ({ id, nickname }) => {
      updatePlayer(id, { nickname });
    };

    const handleRemovePlayer = (id) => {
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[id];
        return newPlayers;
      });
    };

    const handlePlayerTyping = ({ id }) => {
      updatePlayer(id, { isTyping: true });
    };

    const handlePlayerStopTyping = ({ id }) => {
      updatePlayer(id, { isTyping: false });
    };

    const handleReceiveMessage = ({ id, message }) => {
      setPlayers((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], currentMessage: message },
        };
      });
    };

    const handleClearMessage = ({ id }) => {
      setPlayers((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], currentMessage: "" },
        };
      });
    };

    socket.on("currentPlayers", handleCurrentPlayers);
    socket.on("newPlayer", handlePlayerStatus);
    socket.on("updatePlayer", handlePlayerStatus);
    socket.on("removePlayer", handleRemovePlayer);
    socket.on("nicknameUpdate", handleNicknameUpdate);
    socket.on("typing", handlePlayerTyping);
    socket.on("stopTyping", handlePlayerStopTyping);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("clearMessage", handleClearMessage);

    return () => {
      socket.off("currentPlayers", handleCurrentPlayers);
      socket.off("newPlayer", handlePlayerStatus);
      socket.off("updatePlayer", handlePlayerStatus);
      socket.off("removePlayer", handleRemovePlayer);
      socket.off("nicknameUpdate", handleNicknameUpdate);
      socket.off("typing", handlePlayerTyping);
      socket.off("stopTyping", handlePlayerStopTyping);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("clearMessage", handleClearMessage);
      Object.values(messageTimer.current).forEach(clearTimeout);
      messageTimer.current = {};
    };
  }, [socket]);

  return players;
}
