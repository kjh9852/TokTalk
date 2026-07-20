import OtherPlayer from "@/canvas/player/OtherPlayer";
import Player from "@/canvas/player/Player";

export default function PlayerManager({ players, socket, onPlayerUpdate }) {
  return (
    <>
      {Object.entries(players).map(([id, state]) => {
        const isLocal = id === socket.id;
        return isLocal ? (
          <Player
            key={id}
            id={id}
            onUpdate={onPlayerUpdate}
            isTyping={state.isTyping}
            message={state.currentMessage}
            nickname={state.nickname ?? "익명"}
            socket={socket}
            players={players}
          />
        ) : (
          <OtherPlayer
            key={id}
            id={id}
            position={state.position}
            rotation={state.rotation}
            isTyping={state.isTyping}
            isMoving={state.isMoving}
            message={state.currentMessage}
            nickname={state.nickname ?? "익명"}
          />
        );
      })}
    </>
  );
}
