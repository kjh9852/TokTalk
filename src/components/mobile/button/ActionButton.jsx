import nextIcon from "@/assets/icons/next.png";
import prevIcon from "@/assets/icons/prev.png";
import writeIcon from "@/assets/icons/write.png";
import { useInteractionStore } from "@/store/interactionStore";

import styles from "./MobileButton.module.css";

const ACTION_ICON = {
  write: writeIcon,
  prev: prevIcon,
  next: nextIcon,
};

export default function ActionButton() {
  const currentInteractable = useInteractionStore(
    (state) => state.currentInteractable,
  );

  return (
    <button
      className={`${styles.mobileButton} ${styles.action}`}
      onClick={() => {
        currentInteractable.interact();
      }}
      disabled={!currentInteractable}
    >
      {currentInteractable ? (
        <img
          className={styles[currentInteractable?.icon]}
          src={ACTION_ICON[currentInteractable?.icon]}
          alt={currentInteractable.id}
        />
      ) : (
        "액션"
      )}
    </button>
  );
}
