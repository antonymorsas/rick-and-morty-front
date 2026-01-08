'use client';

import { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAction } from '@/hooks/useAction';
import { getCharactersPage, searchCharacters } from '@/actions/characters';
import type { CharactersResponse } from '@/types/api';
import type { Character } from '@/types/character';
import CharacterCard from './CharacterCard';
import { SkeletonGrid } from './Skeleton';
import SearchInput from './SearchInput';
import styles from './CharacterList.module.css';

interface CharacterListProps {
  initialData: CharactersResponse;
  selectedCharacterId?: number;
}

export default function CharacterList({ initialData, selectedCharacterId }: CharacterListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CHARACTERS_PER_PAGE_UI = 4;
  const [cachedCharacters, setCachedCharacters] = useState<Character[]>(initialData.results);
  const [info, setInfo] = useState(initialData.info);
  const [apiPage, setApiPage] = useState(1);
  const [internalPage, setInternalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigatingBackward, setIsNavigatingBackward] = useState(false);

  const handleCharacterClick = useCallback((id: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('characterId', id.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const { error, isLoading, execute } = useAction<CharactersResponse>({
    onSuccess: (data) => {
      if (data) {
        setCachedCharacters(data.results);
        setInfo(data.info);
        if (isNavigatingBackward) {
          const lastInternalPage = Math.ceil(data.results.length / CHARACTERS_PER_PAGE_UI);
          setInternalPage(lastInternalPage);
          setIsNavigatingBackward(false);
        } else {
          setInternalPage(1);
        }
      }
    },
  });

  const displayedCharacters = useMemo(() => {
    const startIndex = (internalPage - 1) * CHARACTERS_PER_PAGE_UI;
    const endIndex = startIndex + CHARACTERS_PER_PAGE_UI;
    return cachedCharacters.slice(startIndex, endIndex);
  }, [cachedCharacters, internalPage]);

  const totalInternalPages = useMemo(() => {
    return Math.ceil(cachedCharacters.length / CHARACTERS_PER_PAGE_UI);
  }, [cachedCharacters]);

  const hasMoreInCache = useMemo(() => {
    return internalPage < totalInternalPages;
  }, [internalPage, totalInternalPages]);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      if (hasMoreInCache) {
        setInternalPage(internalPage + 1);
      } else {
        const nextApiPage = apiPage + 1;
        setApiPage(nextApiPage);
        if (searchQuery) {
          execute(() => searchCharacters(searchQuery, nextApiPage));
        } else {
          execute(() => getCharactersPage(nextApiPage));
        }
      }
    } else {
      if (internalPage > 1) {
        setInternalPage(internalPage - 1);
      } else {
        const prevApiPage = apiPage - 1;
        if (prevApiPage >= 1) {
          setApiPage(prevApiPage);
          setIsNavigatingBackward(true);
          if (searchQuery) {
            execute(() => searchCharacters(searchQuery, prevApiPage));
          } else {
            execute(() => getCharactersPage(prevApiPage));
          }
        }
      }
    }
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setApiPage(1);
    setInternalPage(1);
    if (query.trim()) {
      setCachedCharacters([]);
      execute(() => searchCharacters(query, 1));
    } else {
      execute(() => getCharactersPage(1));
    }
  }, [execute]);

  return (
    <div className={styles.container}>
      <SearchInput onSearch={handleSearch} />
      
      {/* Error Message - Only show if it's not a "Not Found" error during search */}
      {error && !(searchQuery && (
        error.message.includes('Not Found') || 
        error.message.includes('404') ||
        error.message.toLowerCase().includes('not found')
      )) && (
        <div className={styles.errorMessage}>
          {error.message}
        </div>
      )}

      {/* Characters Grid */}
      {!isLoading && cachedCharacters.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No characters found.</p>
        </div>
      ) : (
        <div className={styles.charactersWrapper}>
          {isLoading ? (
            <SkeletonGrid count={CHARACTERS_PER_PAGE_UI} />
          ) : displayedCharacters.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No characters found.</p>
            </div>
          ) : (
            <div className={styles.charactersGrid}>
              {displayedCharacters.map((character) => (
                <CharacterCard 
                  key={character.id} 
                  character={character}
                  isSelected={character.id === selectedCharacterId}
                  onClick={handleCharacterClick}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {(info.pages > 1 || hasMoreInCache || internalPage > 1 || isLoading) && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange('prev')}
                disabled={(internalPage === 1 && apiPage === 1) || isLoading}
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
                onClick={() => handlePageChange('next')}
                disabled={(!hasMoreInCache && !info.next) || isLoading}
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
    </div>
  );
}

