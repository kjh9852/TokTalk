import { isMobile } from "@/utils/device";

import DesktopGuide from "@/components/guide/DesktopGuide";
import MobileGuide from "@/components/guide/MobileGuide";

export default function ControlGuide() {
  return isMobile ? <MobileGuide /> : <DesktopGuide />;
}
