import { Character } from './character';

// API_BASE_URL removed - rickmortyapi package handles base URL internally

export interface ApiInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResponse<T> {
  info: ApiInfo;
  results: T[];
}

export type CharactersResponse = PaginatedResponse<Character>;

