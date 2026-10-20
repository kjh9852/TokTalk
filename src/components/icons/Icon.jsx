import GuideIcon from "@/assets/icons/guide.svg?react";
import InfomationIcon from "@/assets/icons/infomation.svg?react";
import MenuIcon from "@/assets/icons/menu.svg?react";
import SettingIcon from "@/assets/icons/setting.svg?react";
import UserIcon from "@/assets/icons/user.svg?react";

const icons = {
  menu: MenuIcon,
  infomation: InfomationIcon,
  setting: SettingIcon,
  user: UserIcon,
  guide: GuideIcon,
};

export default function Icon({ size = 34, name }) {
  const Component = icons[name];

  if (!Component) return null;

  return (
    <Component
      width={size}
      height={size}
    />
  );
}
