import * as THREE from "three";

const tempForward = new THREE.Vector3();
const tempDirectionToTarget = new THREE.Vector3();
const UP_AXIS = new THREE.Vector3(0, 1, 0);

export const handlePush = ({
  pushCooldownRef,
  playerRef,
  players,
  socket,
  yaw,
}) => {
  const now = Date.now();
  if (now < pushCooldownRef.current) return;

  pushCooldownRef.current = now + 1000;

  const myPos = playerRef.current.translation();

  const forwardVector = tempForward.set(0, 0, -1).applyAxisAngle(UP_AXIS, yaw);

  let targetId = null;
  let nearestDistance = Infinity;

  Object.entries(players).forEach(([id, state]) => {
    if (id === socket.id) return;

    const dx = state.position[0] - myPos.x;
    const dz = state.position[2] - myPos.z;

    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance > 3) return;

    const directionToTarget = tempDirectionToTarget.set(dx, 0, dz).normalize();

    const dot = forwardVector.dot(directionToTarget);

    if (dot < 0.7) return;

    if (distance < nearestDistance) {
      nearestDistance = distance;
      targetId = id;
    }
  });

  if (!targetId) return;

  socket.emit("pushPlayer", {
    targetId,
  });
};
