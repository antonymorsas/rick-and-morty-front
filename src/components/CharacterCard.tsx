import Image from 'next/image';
import type { Character } from '@/types/character';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
}

export default function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>
        {character.name}
      </h3>
      <div className={styles.imageContainer}>
        <Image
          src={character.image}
          alt={character.name}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 768px) 100vw, 33vw"
        />
      </div>
    </div>
  );
}

