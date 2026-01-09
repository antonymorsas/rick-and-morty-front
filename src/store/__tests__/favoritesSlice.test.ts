import { configureStore } from '@reduxjs/toolkit';
import favoritesReducer, {
  addFavorite,
  removeFavorite,
  toggleFavorite,
  loadFavorites,
  selectFavorites,
  selectIsFavorite,
} from '../favoritesSlice';
import type { Character } from '@/types/character';

const mockCharacter1: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

const mockCharacter2: Character = {
  id: 2,
  name: 'Morty Smith',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'unknown', url: '' },
  location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
  image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/2',
  created: '2017-11-04T18:50:21.651Z',
};

describe('favoritesSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    localStorage.clear();
    store = configureStore({
      reducer: {
        favorites: favoritesReducer,
      },
    });
  });

  describe('addFavorite', () => {
    it('should add a character to favorites', () => {
      store.dispatch(addFavorite(mockCharacter1));
      const state = store.getState();
      const favorites = selectFavorites(state);

      expect(favorites).toHaveLength(1);
      expect(favorites[0]).toEqual(mockCharacter1);
      expect(selectIsFavorite(mockCharacter1.id)(state)).toBe(true);
    });

    it('should not add duplicate characters', () => {
      store.dispatch(addFavorite(mockCharacter1));
      store.dispatch(addFavorite(mockCharacter1));
      const state = store.getState();
      expect(selectFavorites(state)).toHaveLength(1);
    });

    it('should persist to localStorage', () => {
      store.dispatch(addFavorite(mockCharacter1));
      const stored = localStorage.getItem('rick-morty-favorites');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toHaveLength(1);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a character from favorites', () => {
      store.dispatch(addFavorite(mockCharacter1));
      store.dispatch(addFavorite(mockCharacter2));
      store.dispatch(removeFavorite(mockCharacter1.id));
      
      const state = store.getState();
      const favorites = selectFavorites(state);
      expect(favorites).toHaveLength(1);
      expect(selectIsFavorite(mockCharacter1.id)(state)).toBe(false);
    });
  });

  describe('toggleFavorite', () => {
    it('should add character if not in favorites', () => {
      store.dispatch(toggleFavorite(mockCharacter1));
      const state = store.getState();
      expect(selectFavorites(state)).toHaveLength(1);
      expect(selectIsFavorite(mockCharacter1.id)(state)).toBe(true);
    });

    it('should remove character if already in favorites', () => {
      store.dispatch(addFavorite(mockCharacter1));
      store.dispatch(toggleFavorite(mockCharacter1));
      const state = store.getState();
      expect(selectFavorites(state)).toHaveLength(0);
    });
  });

  describe('loadFavorites', () => {
    it('should load favorites from localStorage', () => {
      localStorage.setItem('rick-morty-favorites', JSON.stringify([mockCharacter1, mockCharacter2]));
      store.dispatch(loadFavorites());
      const state = store.getState();
      const favorites = selectFavorites(state);

      expect(favorites).toHaveLength(2);
      expect(favorites).toContainEqual(mockCharacter1);
    });
  });
});
