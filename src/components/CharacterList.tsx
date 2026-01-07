'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useAction } from '@/hooks/useAction';
import { getCharactersPage, searchCharacters } from '@/actions/characters';
import type { CharactersResponse } from '@/types/api';
import CharacterCard from './CharacterCard';
import { SkeletonGrid } from './Skeleton';
import SearchInput from './SearchInput';
import styles from './CharacterList.module.css';

interface CharacterListProps {
  initialData: CharactersResponse;
}

export default function CharacterList({ initialData }: CharacterListProps) {
  const [characters, setCharacters] = useState(initialData.results);
  const [info, setInfo] = useState(initialData.info);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
    if (searchQuery) {
      execute(() => searchCharacters(searchQuery, page));
    } else {
      execute(() => getCharactersPage(page));
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (query.trim()) {
      execute(() => searchCharacters(query, 1));
    } else {
      execute(() => getCharactersPage(1));
    }
  };

  return (
    <div className={styles.container}>
      <SearchInput onSearch={handleSearch} />
      
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
                    <Image 
                      src="/icons/arrow.svg" 
                      alt="previous page" 
                      width={17} 
                      height={11}
                      className={styles.arrowIcon}
                    />
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!info.next || isLoading}
                    className={styles.paginationButton}
                  >
                    <Image 
                      src="/icons/arrow.svg" 
                      alt="next page" 
                      width={17} 
                      height={11}
                      className={`${styles.arrowIcon} ${styles.arrowIconRotated}`}
                    />
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

