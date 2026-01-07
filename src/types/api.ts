import { Character } from './character';

export const API_BASE_URL = process.env.RICK_AND_MORTY_API_URL || 'https://rickandmortyapi.com/api';

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

