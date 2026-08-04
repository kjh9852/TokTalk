import { useCallback, useEffect, useMemo } from "react";

import woodTexture from "@/assets/images/wood.png";
import { useAdmin } from "@/context/AdminContext";
import { useInteractionStore } from "@/store/interactionStore";
import { useModalStore } from "@/store/modalStore";
import { useUserStore } from "@/store/userStore";
import { isMobile } from "@/utils/device";
import { isWithDistance } from "@/utils/distance";
import { Text, useGLTF, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Signpost() {
  const { scene } = useGLTF("/models/signs.glb");
  const { isAdmin } = useAdmin();
  const texture = useTexture(woodTexture);
  const openModal = useModalStore((state) => state.openModal);
  const controls = useUserStore((state) => state.controls);
  const myPosition = useUserStore((state) => state.myPosition);
  const cloneScene = useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1); // 숫자 늘리면 더 촘촘하게

    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture; // 기존 머티리얼에 텍스쳐 입히기
        child.material.needsUpdate = true;
      }
    });
  }, [scene, texture]);

  const handlePostModalOpen = useCallback(
    (type) => {
      setTimeout(() => {
        if (!isMobile) {
          controls.unlock();
        }

        openModal(type);
      }, 0);
    },
    [openModal, controls],
  );

  useEffect(() => {
    const { addInteractable, removeInteractable } =
      useInteractionStore.getState();

    addInteractable({
      id: "sign-post",
      icon: "write",
      position: {
        x: 3.5,
        z: 4,
      },
      range: 2.5,
      interact: () => {
        openModal("post");
      },
    });

    return () => removeInteractable("sign-post");
  }, [openModal]);

  return (
    <>
      <RigidBody
        type="fixed"
        position={[3.5, 0, 4]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <group
          onClick={() => {
            if (!isWithDistance(myPosition, { x: 3.5, z: 4 }, 2.5)) {
              return;
            }
            handlePostModalOpen("post");
          }}
        >
          <primitive object={scene} scale={[0.4, 0.4, 0.4]} />
          <Text
            position={[0, 1.3, 0]}
            rotation={[0, Math.PI / 2, 0]}
            fontSize={0.2}
            color="black"
          >
            글쓰기
          </Text>
        </group>
      </RigidBody>
      {isAdmin && (
        <RigidBody
          type="fixed"
          position={[1.5, 0, 4]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <group
            onClick={() => {
              if (!isWithDistance(myPosition, { x: 1.5, z: 4 }, 2.5)) {
                return;
              }
              handlePostModalOpen("postedit");
            }}
          >
            <primitive object={cloneScene} scale={[0.4, 0.4, 0.4]} />
            <Text
              position={[0, 1.3, 0]}
              rotation={[0, Math.PI / 2, 0]}
              fontSize={0.2}
              color="black"
            >
              게시글 관리
            </Text>
          </group>
        </RigidBody>
      )}
    </>
  );
}

useGLTF.preload("/models/signs.glb");
