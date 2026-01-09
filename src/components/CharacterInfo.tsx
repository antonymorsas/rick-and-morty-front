import Image from "next/image";
import type { Character } from "@/types/character";
import CharacterStatus from "./CharacterStatus";
import styles from "./CharacterInfo.module.css";

interface CharacterInfoProps {
  character: Character | null;
  characterId?: number;
}

export default function CharacterInfo({ character, characterId }: CharacterInfoProps) {
  if (!character && characterId !== undefined) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContent}>
          <h3 className={styles.errorTitle}>Character Not Found</h3>
          <p className={styles.errorMessage}>
            The character with ID <strong>{characterId}</strong> does not exist.
          </p>
        </div>
      </div>
    );
  }

  if (!character) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.statusContainer}>
        <CharacterStatus status={character.status} />
      </div>
      <div className={styles.imageContainer}>
        <Image 
          src={character.image} 
          alt={character.name} 
          fill
          className={styles.image}
          sizes="100vw"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{character.name}</h3>
        <p className={styles.species}>{character.species}</p>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <p className={styles.title}>Origin</p>
            <p className={styles.detailValue}>{character.origin.name}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.title}>Location</p>
            <p className={styles.detailValue}>{character.location.name}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.title}>Gender</p>
            <p className={styles.detailValue}>{character.gender}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.title}>Episodes</p>
            <p className={styles.detailValue}>{character.episode.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

