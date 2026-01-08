'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectFavorites, removeFavorite } from '@/store/favoritesSlice';
import type { Character } from '@/types/character';
import styles from './Favs.module.css';

export default function Favs() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const favorites = useAppSelector(selectFavorites);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCharacterClick = (character: Character) => {
    router.push(`?characterId=${character.id}`, { scroll: false });
    setIsOpen(false);
  };

  const handleRemoveFavorite = (e: React.MouseEvent, characterId: number) => {
    e.stopPropagation();
    dispatch(removeFavorite(characterId));
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <div 
        className={`${styles.button} ${isOpen ? styles.buttonExpanded : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.buttonText}>
          Favs {favorites.length > 0 && `(${favorites.length})`}
        </span>
      </div>
      {isOpen && (
        <div className={styles.expandedList}>
          <div className={styles.favoritesList}>
            {favorites.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No hay favoritos aún</p>
              </div>
            ) : (
              favorites.map((character) => (
                <div
                  key={character.id}
                  className={styles.favoriteItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCharacterClick(character);
                  }}
                >
                  <span className={styles.favoriteName}>{character.name}</span>
                  <button
                    className={styles.deleteButton}
                    onClick={(e) => handleRemoveFavorite(e, character.id)}
                    aria-label="Eliminar de favoritos"
                  >
                    <Image
                      src="/icons/trash.svg"
                      alt="Eliminar"
                      width={12}
                      height={12}
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

