'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { loadFavorites } from './favoritesSlice';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(loadFavorites());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

