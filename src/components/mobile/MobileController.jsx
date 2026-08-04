import MobileJoystick from "./MobileJoystick";
import TouchLookArea from "./TouchLookArea";
import MobileChat from "./chat/MobileChat";

export default function MobileController({ socket }) {
  return (
    <>
      <MobileJoystick />
      <TouchLookArea />
      <MobileChat socket={socket} />
    </>
  );
}
