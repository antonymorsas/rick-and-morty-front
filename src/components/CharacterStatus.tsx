import type { Character } from "@/types/character";
import styles from "./CharacterStatus.module.css";

interface CharacterStatusProps {
  status: Character["status"];
}

export default function CharacterStatus({ status }: CharacterStatusProps) {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case 'alive':
        return styles.alive;
      case 'dead':
        return styles.dead;
      default:
        return styles.unknown;
    }
  };

  return (
    <div className={styles.container}>
      <span className={`${styles.indicator} ${getStatusClass()}`}></span>
      <span className={styles.statusText}>{status.toUpperCase()}</span>
    </div>
  );
}
