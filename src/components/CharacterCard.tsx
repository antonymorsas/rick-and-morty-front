'use client';

import Image from 'next/image';
import type { Character } from '@/types/character';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite, selectIsFavorite } from '@/store/favoritesSlice';
import styles from './CharacterCard.module.css';

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onClick?: (id: number) => void;
}

export default function CharacterCard({ character, isSelected = false, onClick }: CharacterCardProps) {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector(selectIsFavorite(character.id));

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(character));
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(character.id);
    }
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleCardClick}
    >
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
      <div className={`w-full flex justify-center items-center gap-2 mt-2 cursor-pointer select-none ${styles.favoriteButton}`} onClick={handleToggleFavorite}>
        <Image
          src="/icons/heart.svg"
          alt="Like"
          width={20}
          height={20}
          className={isFavorite ? styles.favoriteIconActive : styles.favoriteIcon}
        />
        Like
      </div>
    </div>
  );
}

