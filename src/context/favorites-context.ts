import { createContext } from 'react';

export type FavoriteToggleResult = 'added' | 'removed';

export type FavoritesContextValue = {
  favoriteIds: string[];
  pendingIds: string[];
  isFavoritesLoading: boolean;
  isFavorite: (productId: string | number | null | undefined) => boolean;
  isPending: (productId: string | number | null | undefined) => boolean;
  toggleFavorite: (productId: string | number) => Promise<FavoriteToggleResult>;
  refreshFavorites: () => Promise<void>;
};

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);
