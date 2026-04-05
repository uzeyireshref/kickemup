import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  FavoritesContext,
  type FavoriteToggleResult,
  type FavoritesContextValue,
} from './favorites-context';

type FavoriteRow = {
  product_id: string;
};

const normalizeProductId = (productId: string | number | null | undefined) => {
  if (productId === null || productId === undefined) return '';
  return String(productId);
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [isFavoritesLoading, setIsFavoritesLoading] = useState(false);

  const refreshFavorites = useCallback(async () => {
    if (!userId) {
      setFavoriteIds([]);
      setPendingIds([]);
      setIsFavoritesLoading(false);
      return;
    }

    setIsFavoritesLoading(true);

    const { data, error } = await supabase
      .from('user_favorites')
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      console.error('Favorites fetch error:', error);
      setIsFavoritesLoading(false);
      return;
    }

    const rows = (data || []) as FavoriteRow[];
    setFavoriteIds(rows.map((row) => row.product_id));
    setIsFavoritesLoading(false);
  }, [userId]);

  useEffect(() => {
    void refreshFavorites();
  }, [refreshFavorites]);

  const favoriteIdSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);
  const pendingIdSet = useMemo(() => new Set(pendingIds), [pendingIds]);

  const isFavorite = useCallback((productId: string | number | null | undefined) => {
    const normalizedProductId = normalizeProductId(productId);
    return normalizedProductId.length > 0 && favoriteIdSet.has(normalizedProductId);
  }, [favoriteIdSet]);

  const isPending = useCallback((productId: string | number | null | undefined) => {
    const normalizedProductId = normalizeProductId(productId);
    return normalizedProductId.length > 0 && pendingIdSet.has(normalizedProductId);
  }, [pendingIdSet]);

  const toggleFavorite = useCallback(async (productIdInput: string | number): Promise<FavoriteToggleResult> => {
    if (!userId) {
      throw new Error('AUTH_REQUIRED');
    }

    const productId = normalizeProductId(productIdInput);
    if (!productId) {
      throw new Error('PRODUCT_ID_REQUIRED');
    }

    const currentlyFavorite = favoriteIdSet.has(productId);

    setPendingIds((current) => (
      current.includes(productId) ? current : [...current, productId]
    ));

    setFavoriteIds((current) => (
      currentlyFavorite
        ? current.filter((id) => id !== productId)
        : Array.from(new Set([...current, productId]))
    ));

    try {
      if (currentlyFavorite) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);

        if (error) throw error;
        return 'removed';
      }

      const { error } = await supabase
        .from('user_favorites')
        .upsert({
          user_id: userId,
          product_id: productId,
        }, {
          onConflict: 'user_id,product_id',
          ignoreDuplicates: true,
        });

      if (error) throw error;
      return 'added';
    } catch (error) {
      console.error('Favorite toggle error:', error);
      setFavoriteIds((current) => (
        currentlyFavorite
          ? Array.from(new Set([...current, productId]))
          : current.filter((id) => id !== productId)
      ));
      throw error;
    } finally {
      setPendingIds((current) => current.filter((id) => id !== productId));
    }
  }, [favoriteIdSet, userId]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favoriteIds,
    pendingIds,
    isFavoritesLoading,
    isFavorite,
    isPending,
    toggleFavorite,
    refreshFavorites,
  }), [favoriteIds, pendingIds, isFavoritesLoading, isFavorite, isPending, toggleFavorite, refreshFavorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
