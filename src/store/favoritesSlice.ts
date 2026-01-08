import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '@/types/character';
import type { FavoritesState } from './types';

const FAVORITES_STORAGE_KEY = 'rick-morty-favorites';

const loadFavoritesFromStorage = (): Character[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

const saveFavoritesToStorage = (favorites: Character[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Character>) => {
      const character = action.payload;
      const exists = state.favorites.some(fav => fav.id === character.id);
      if (!exists) {
        state.favorites.push(character);
        saveFavoritesToStorage(state.favorites);
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      saveFavoritesToStorage(state.favorites);
    },
    toggleFavorite: (state, action: PayloadAction<Character>) => {
      const character = action.payload;
      const index = state.favorites.findIndex(fav => fav.id === character.id);
      if (index >= 0) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(character);
      }
      saveFavoritesToStorage(state.favorites);
    },
    loadFavorites: (state) => {
      state.favorites = loadFavoritesFromStorage();
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, loadFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.favorites;
export const selectIsFavorite = (characterId: number) => (state: { favorites: FavoritesState }) =>
  state.favorites.favorites.some(fav => fav.id === characterId);

export default favoritesSlice.reducer;

