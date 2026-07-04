export const isWithDistance = (player, target, radius) => {
  const dx = player.x - target.x;
  const dz = player.z - target.z;

  const distance = Math.sqrt(dx * dx + dz * dz);

  return distance < radius;
};
