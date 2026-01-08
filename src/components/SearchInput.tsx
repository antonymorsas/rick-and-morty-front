import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './SearchInput.module.css';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export default function SearchInput({ 
  onSearch, 
  placeholder = 'Find your character...',
  debounceMs = 500 
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstRender = useRef(true);
  const previousQueryRef = useRef('');
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousQueryRef.current = query;
      return;
    }

    if (query === previousQueryRef.current) {
      return;
    }

    previousQueryRef.current = query;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim() === '') {
      onSearchRef.current(query);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearchRef.current(query);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, debounceMs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputContainer}>
        <Image 
          src="/icons/search.svg" 
          alt="search icon" 
          width={20} 
          height={20}
          className={styles.searchIcon}
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.input}
        />
      </div>
    </form>
  );
}

