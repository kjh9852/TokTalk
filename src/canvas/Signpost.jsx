import { useEffect } from "react";

import woodTexture from "@/assets/images/wood.png";
import { useAdmin } from "@/context/AdminContext";
import { useModalContext } from "@/context/ModalContextProvider";
import { Text, useGLTF, useTexture } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export default function Signpost({ controlsRef }) {
  const { scene } = useGLTF("/models/signs.glb");
  const { isAdmin } = useAdmin();
  const texture = useTexture(woodTexture);
  const { setModalType, handleModalOpen } = useModalContext();

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

  const handlePostModalOpen = (type) => {
    if (controlsRef.current) {
      document.exitPointerLock();
      controlsRef.current.unlock?.();
    }
    setTimeout(() => {
      setModalType(type);
      console.log(document.pointerLockElement === null);
      handleModalOpen();
    }, 50);
  };

  return (
    <>
      <RigidBody
        type="fixed"
        position={[3, 0, 6]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <group onClick={() => handlePostModalOpen("post")}>
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
          position={[1, 0, 6]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <group onClick={() => handlePostModalOpen("postedit")}>
            <primitive object={scene.clone()} scale={[0.4, 0.4, 0.4]} />
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
