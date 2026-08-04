import MobileJoystick from "./MobileJoystick";
import TouchLookArea from "./TouchLookArea";
import ActionButton from "./button/ActionButton";
import MobileButton from "./button/MobileButton";
import { DEFAULT_BUTTON } from "./button/buttonConfig";
import MobileChat from "./chat/MobileChat";

export default function MobileController({ socket }) {
  return (
    <>
      <MobileJoystick />
      <TouchLookArea />
      <MobileChat socket={socket} />
      {DEFAULT_BUTTON.map((item) => (
        <MobileButton key={item.type} type={item.type} icon={item.icon} />
      ))}
      <ActionButton />
    </>
  );
}
