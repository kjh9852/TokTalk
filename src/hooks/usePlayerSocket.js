import { useEffect, useRef, useState } from "react";

export default function usePlayerSocket(socket) {
  const [players, setPlayers] = useState({});
  const messageTimer = useRef({});

  useEffect(() => {
    if (!socket) return;

    const handleCurrentPlayers = (currentPlayers) => {
      setPlayers(currentPlayers);
    };

    const handleNewPlayer = ({ id, state }) => {
      setPlayers((prev) => ({ ...prev, [id]: state }));
    };

    const handleUpdatePlayer = ({ id, state }) => {
      setPlayers((prev) => ({ ...prev, [id]: state }));
    };

    const handleNicknameUpdate = ({ id, nickname }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          nickname,
        },
      }));
    };

    const handleRemovePlayer = (id) => {
      setPlayers((prev) => {
        const newPlayers = { ...prev };
        delete newPlayers[id];
        return newPlayers;
      });
    };

    const handlePlayerTyping = ({ id }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], isTyping: true },
      }));
      console.log(id);
    };

    const handlePlayerStopTyping = ({ id }) => {
      setPlayers((prev) => ({
        ...prev,
        [id]: { ...prev[id], isTyping: false },
      }));
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
    socket.on("newPlayer", handleNewPlayer);
    socket.on("updatePlayer", handleUpdatePlayer);
    socket.on("removePlayer", handleRemovePlayer);
    socket.on("nicknameUpdate", handleNicknameUpdate);
    socket.on("typing", handlePlayerTyping);
    socket.on("stopTyping", handlePlayerStopTyping);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("clearMessage", handleClearMessage);

    return () => {
      socket.off("currentPlayers", handleCurrentPlayers);
      socket.off("newPlayer", handleNewPlayer);
      socket.off("updatePlayer", handleUpdatePlayer);
      socket.off("removePlayer", handleRemovePlayer);
      socket.off("nicknameUpdate", handleNicknameUpdate);
      socket.off("typing", handlePlayerTyping);
      socket.off("stopTyping", handlePlayerStopTyping);
      socket.off("receiveMessage");
      socket.off("clearMessage");
      Object.values(messageTimer.current).forEach(clearTimeout);
      messageTimer.current = {};
    };
  }, [socket]);

  return players;
}
