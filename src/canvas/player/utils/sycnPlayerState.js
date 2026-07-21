export const syncPlayerState = ({
  now,
  playerRef,
  setMyPosition,
  isMoving,
  lastSentRef,
  onUpdate,
}) => {
  if (now - lastSentRef.current <= 100) return;

  const playerPosition = playerRef.current.translation();
  const playerRotation = playerRef.current.rotation();

  setMyPosition({
    x: playerPosition.x,
    y: playerPosition.y,
    z: playerPosition.z,
  });

  const newState = {
    position: [playerPosition.x, playerPosition.y, playerPosition.z],
    rotation: [
      playerRotation.x,
      playerRotation.y,
      playerRotation.z,
      playerRotation.w,
    ],
    isMoving: isMoving,
  };

  onUpdate(newState); // 부모 컴포넌트를 통해 서버에 데이터 전송

  lastSentRef.current = now;
};
