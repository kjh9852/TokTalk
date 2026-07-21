import * as THREE from "three";

const tempLookDir = new THREE.Vector3();
const tempLookTarget = new THREE.Vector3();
const tempCameraPos = new THREE.Vector3();

const UP_AXIS = new THREE.Vector3(0, 1, 0);
const tempPitchQuat = new THREE.Quaternion();
const tempEuler = new THREE.Euler();
const tempYawOffset = new THREE.Vector3();

export const updateCamera = ({ playerRef, camera, yaw, pitch }) => {
  // 카메라 위치: 캐릭터 뒤쪽 위치로 고정
  const pos = playerRef.current.translation();

  const yawOffset = tempYawOffset.set(0, 0, 4).applyAxisAngle(UP_AXIS, yaw);

  const pitchQuat = tempPitchQuat.setFromEuler(tempEuler.set(pitch, 0, 0));

  const lookDir = tempLookDir.set(0, 0, -1).applyQuaternion(pitchQuat);
  lookDir.applyAxisAngle(UP_AXIS, yaw);

  const lookTarget = tempLookTarget.set(pos.x, pos.y + 1.5, pos.z).add(lookDir);

  const cameraPos = tempCameraPos.set(pos.x, pos.y + 1.5, pos.z).add(yawOffset);

  camera.position.copy(cameraPos);
  camera.lookAt(lookTarget); // 캐릭터 머리 쪽 보기
};
