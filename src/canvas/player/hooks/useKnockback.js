import { useEffect, useRef } from "react";

export default function useKnockback({ socket, playerRef, onUpdate }) {
  const knockbackUntil = useRef(0);

  useEffect(() => {
    if (!socket) return;

    const handleKnockback = ({ x, z }) => {
      knockbackUntil.current = performance.now() + 300;

      playerRef.current?.applyImpulse(
        {
          x: x * 3,
          y: 2,
          z: z * 3,
        },
        true,
      );

      // 넉백 적용 후 즉시 위치 동기화
      setTimeout(() => {
        const pos = playerRef.current?.translation();
        const rot = playerRef.current?.rotation();

        if (!pos || !rot) return;

        onUpdate({
          position: [pos.x, pos.y, pos.z],
          rotation: [rot.x, rot.y, rot.z, rot.w],
          isMoving: true,
        });
      }, 100);
    };

    socket.on("knockback", handleKnockback);

    return () => {
      socket.off("knockback", handleKnockback);
    };
  }, [socket, onUpdate, playerRef]);

  const isKnockback = performance.now() < knockbackUntil.current;

  return { isKnockback };
}
