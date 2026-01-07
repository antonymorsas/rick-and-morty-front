import Image from "next/image";
import type { Character } from "@/types/character";
import styles from "./CharacterInfo.module.css";

interface CharacterInfoProps {
  character: Character;
}

export default function CharacterInfo({ character }: CharacterInfoProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image src={character.image} alt={character.name} width={600} height={200} />
      </div>
      <div className={styles.infoSection}>
        <h3 className={styles.title}>{character.name}</h3>
        <p className={styles.species}>{character.species}</p>

        <div className={styles.detailsGrid}>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Origin</p>
            <p className={styles.detailValue}>{character.origin.name}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Location</p>
            <p className={styles.detailValue}>{character.location.name}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Gender</p>
            <p className={styles.detailValue}>{character.gender}</p>
          </div>
          <div className={styles.detailItem}>
            <p className={styles.detailLabel}>Episodes</p>
            <p className={styles.detailValue}>{character.episode.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

