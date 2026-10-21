import Key from "@/components/ui/Key/Key";

import styles from "./WasdKey.module.css";

export default function WasdKey() {
  return (
    <div className={styles.wasd}>
      <Key>W</Key>
      <Key>A</Key>
      <Key>S</Key>
      <Key>D</Key>
    </div>
  );
}
