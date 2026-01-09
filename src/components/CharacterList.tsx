'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [paginationTop, setPaginationTop] = useState<string>('50%');
  const paginationRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !paginationRef.current) return;

    const updatePaginationPosition = () => {
      const characterInfoWrapper = document.querySelector('[data-character-info]');
      if (characterInfoWrapper && paginationRef.current) {
        const rect = characterInfoWrapper.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const buttonHeight = 32; // altura del botón
        const topPosition = centerY - buttonHeight / 2;
        setPaginationTop(`${topPosition}px`);
      }
    };

    // Pequeño delay para asegurar que el DOM esté renderizado
    const timeoutId = setTimeout(updatePaginationPosition, 100);
    window.addEventListener('resize', updatePaginationPosition);
    window.addEventListener('scroll', updatePaginationPosition);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updatePaginationPosition);
      window.removeEventListener('scroll', updatePaginationPosition);
    };
  }, [isMobile, selectedCharacterId]);
  
  const CHARACTERS_PER_PAGE_UI = useMemo(() => isMobile ? 2 : 4, [isMobile]);
  const [cachedCharacters, setCachedCharacters] = useState<Character[]>(initialData.results);
  const [info, setInfo] = useState(initialData.info);
  const [apiPage, setApiPage] = useState(1);
  const [internalPage, setInternalPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigatingBackward, setIsNavigatingBackward] = useState(false);
  const prevCharactersPerPageRef = useRef(CHARACTERS_PER_PAGE_UI);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  
  useEffect(() => {
    if (cachedCharacters.length === 0) {
      prevCharactersPerPageRef.current = CHARACTERS_PER_PAGE_UI;
      return;
    }
    
    if (prevCharactersPerPageRef.current === CHARACTERS_PER_PAGE_UI) {
      return;
    }
    
    const totalPages = Math.ceil(cachedCharacters.length / CHARACTERS_PER_PAGE_UI);
    const prevStartIndex = (internalPage - 1) * prevCharactersPerPageRef.current;
    
    let newPage = Math.floor(prevStartIndex / CHARACTERS_PER_PAGE_UI) + 1;

    if (newPage > totalPages && totalPages > 0) {
      newPage = totalPages;
    } else if (newPage < 1) {
      newPage = 1;
    }
    
    const newStartIndex = (newPage - 1) * CHARACTERS_PER_PAGE_UI;
    if (newStartIndex >= cachedCharacters.length && cachedCharacters.length > 0) {
      newPage = Math.max(1, Math.ceil(cachedCharacters.length / CHARACTERS_PER_PAGE_UI));
    }
    
    if (newPage !== internalPage) {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = setTimeout(() => {
        setInternalPage(newPage);
        prevCharactersPerPageRef.current = CHARACTERS_PER_PAGE_UI;
      }, 0);
    } else {
      prevCharactersPerPageRef.current = CHARACTERS_PER_PAGE_UI;
    }
    
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [CHARACTERS_PER_PAGE_UI, cachedCharacters.length, internalPage]);
  
  const effectivePage = internalPage;

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
    const startIndex = (effectivePage - 1) * CHARACTERS_PER_PAGE_UI;
    const endIndex = startIndex + CHARACTERS_PER_PAGE_UI;
    return cachedCharacters.slice(startIndex, endIndex);
  }, [cachedCharacters, effectivePage, CHARACTERS_PER_PAGE_UI]);

  const totalInternalPages = useMemo(() => {
    return Math.ceil(cachedCharacters.length / CHARACTERS_PER_PAGE_UI);
  }, [cachedCharacters, CHARACTERS_PER_PAGE_UI]);

  const hasMoreInCache = useMemo(() => {
    return effectivePage < totalInternalPages;
  }, [effectivePage, totalInternalPages]);

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
            <div 
              ref={paginationRef}
              className={styles.pagination}
              style={isMobile ? { top: paginationTop, transform: 'translateY(0)' } : undefined}
            >
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

