import * as RAPIER from "@dimforge/rapier3d-compat";

const maxDistance = 0.8;
const rayDirection = { x: 0, y: -1, z: 0 };

export const handleJump = ({
  playerRef,
  rapier,
  jumpCountRef,
  isJumpingRef,
  jump,
  doJump,
}) => {
  const world = rapier.world;
  const playerPos = playerRef.current.translation();

  const filter = {
    flags: RAPIER.QueryFilterFlags.EXCLUDE_DYNAMIC,
    excludeRigidBody: playerRef.current,
    excludeCollider: null,
    groups: null,
  };

  const ray = world.castRay(
    new RAPIER.Ray(playerPos, rayDirection),
    maxDistance,
    true,
    null,
    null,
    filter,
    playerRef.current,
  );

  const grounded = !!ray?.collider && Math.abs(ray.timeOfImpact) <= 0.65;

  if (grounded) {
    jumpCountRef.current = 2;
    isJumpingRef.current = false;
  } else if (!jump) {
    isJumpingRef.current = false;
  }

  if (jump && jumpCountRef.current > 0 && !isJumpingRef.current) {
    isJumpingRef.current = true;
    jumpCountRef.current -= 1;

    const isDoubleJump = jumpCountRef.current === 0;

    doJump(isDoubleJump);
  }
};
