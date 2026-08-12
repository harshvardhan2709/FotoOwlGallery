import { create } from 'zustand';
import { api } from '@/services/api';
import { storage } from '@/services/storage';
import { AuthorFilter, GalleryState, PicsumImage } from '@/types/image';

export const useGalleryStore = create<GalleryState>((set, get) => ({
  images: [],
  favorites: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchQuery: '',
  authorFilter: 'ALL',

  loadInitialImages: async () => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const [fetchedImages, storedFavorites] = await Promise.all([
        api.fetchImages(1, 20),
        storage.getFavorites(),
      ]);

      set({
        images: fetchedImages,
        favorites: storedFavorites,
        page: 1,
        hasMore: fetchedImages.length > 0,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch images from Picsum',
        isLoading: false,
      });
    }
  },

  loadMoreImages: async () => {
    const { isLoading, isRefreshing, hasMore, page, images } = get();

    if (isLoading || isRefreshing || !hasMore) return;

    set({ isLoading: true });

    try {
      const nextPage = page + 1;
      const newImages = await api.fetchImages(nextPage, 20);

      if (newImages.length === 0) {
        set({ hasMore: false, isLoading: false });
        return;
      }

      // Deduplicate images by ID
      const existingIds = new Set(images.map((img) => img.id));
      const filteredNew = newImages.filter((img) => !existingIds.has(img.id));

      set({
        images: [...images, ...filteredNew],
        page: nextPage,
        hasMore: newImages.length >= 20,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to load more images',
        isLoading: false,
      });
    }
  },

  refreshImages: async () => {
    set({ isRefreshing: true, error: null });

    try {
      const fetchedImages = await api.fetchImages(1, 20);
      const storedFavorites = await storage.getFavorites();

      set({
        images: fetchedImages,
        favorites: storedFavorites,
        page: 1,
        hasMore: fetchedImages.length > 0,
        isRefreshing: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to refresh images',
        isRefreshing: false,
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setAuthorFilter: (filter: AuthorFilter) => {
    set({ authorFilter: filter });
  },

  loadFavorites: async () => {
    const storedFavorites = await storage.getFavorites();
    set({ favorites: storedFavorites });
  },

  toggleFavorite: async (imageId: string) => {
    const { favorites } = get();
    let updated: string[];

    if (favorites.includes(imageId)) {
      updated = favorites.filter((id) => id !== imageId);
    } else {
      updated = [...favorites, imageId];
    }

    set({ favorites: updated });
    await storage.setFavorites(updated);
  },

  isFavorite: (imageId: string) => {
    return get().favorites.includes(imageId);
  },
}));
