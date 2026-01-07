'use client';

import { useState } from 'react';
import { useAction } from '@/hooks/useAction';
import { getCharactersPage } from '@/actions/characters';
import type { CharactersResponse } from '@/types/api';
import CharacterCard from './CharacterCard';
import { SkeletonGrid } from './Skeleton';
import styles from './CharacterList.module.css';

interface CharacterListProps {
  initialData: CharactersResponse;
}

export default function CharacterList({ initialData }: CharacterListProps) {
  const [characters, setCharacters] = useState(initialData.results);
  const [info, setInfo] = useState(initialData.info);
  const [currentPage, setCurrentPage] = useState(1);

  const { error, isLoading, execute } = useAction<CharactersResponse>({
    onSuccess: (data) => {
      if (data) {
        setCharacters(data.results);
        setInfo(data.info);
      }
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    execute(() => getCharactersPage(page));
  };

  return (
    <div className={styles.container}>
      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          {error.message}
        </div>
      )}

      {/* Loading State */}
      {isLoading && <SkeletonGrid count={8} />}

      {/* Characters Grid */}
      {!isLoading && (
        <>
          {characters.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No characters found.</p>
            </div>
          ) : (
            <div className={styles.charactersWrapper}>
              <div className={styles.charactersGrid}>
                {characters.map((character) => (
                  <CharacterCard key={character.id} character={character} />
                ))}
              </div>

              {/* Pagination */}
              {info.pages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!info.prev || isLoading}
                    className={styles.paginationButton}
                  >
                    B
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!info.next || isLoading}
                    className={styles.paginationButton}
                  >
                    N
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

