import { useInteractionStore } from "@/store/interactionStore";
import { isWithDistance } from "@/utils/distance";

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

  const { currentInteractable, setInteractable, interactables } =
    useInteractionStore.getState();

  const target =
    interactables.find((item) =>
      isWithDistance(
        { x: playerPosition.x, z: playerPosition.z },
        item.position,
        item.range,
      ),
    ) ?? null;

  if (currentInteractable?.id !== target?.id) {
    setInteractable(target);
  }

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
