import { create } from "zustand";

import { api } from "@/services/api";
import { storage } from "@/services/storage";
import { AuthorFilter, GalleryState } from "@/types/image";

export const useGalleryStore = create<GalleryState>((set, get) => ({
  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  images: [],
  favorites: [],

  page: 1,
  hasMore: true,

  // Initial page loading
  isLoading: false,

  // Pagination loading
  isLoadingMore: false,

  // Pull-to-refresh loading
  isRefreshing: false,

  error: null,

  searchQuery: "",
  authorFilter: "ALL",

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  loadInitialImages: async (force = false) => {
    const state = get();

    console.log("[Gallery] loadInitialImages CALLED", {
      currentImages: state.images.length,
      force,
    });

    // Don't start another request
    if (state.isLoading || state.isLoadingMore || state.isRefreshing) {
      console.log("[Gallery] Initial load skipped - request already running");

      return;
    }

    // If images already exist and this isn't
    // a forced reload, only restore favorites.
    if (!force && state.images.length > 0) {
      try {
        const storedFavorites = await storage.getFavorites();

        set({
          favorites: storedFavorites,
        });
      } catch (error) {
        console.error("[Gallery] Failed to load favorites:", error);
      }

      return;
    }

    set({
      isLoading: true,
      error: null,
    });

    try {
      const [fetchedImages, storedFavorites] = await Promise.all([
        api.fetchImages(1, 20),
        storage.getFavorites(),
      ]);

      set({
        images: fetchedImages,

        favorites: storedFavorites,

        page: 1,

        hasMore: fetchedImages.length === 20,

        isLoading: false,

        error: null,
      });

      console.log("[Gallery] Initial images loaded:", fetchedImages.length);
    } catch (error: any) {
      console.error("[Gallery] Initial load error:", error);

      set({
        error: error?.message || "Failed to fetch images from Picsum",

        isLoading: false,
      });
    }
  },

  // --------------------------------------------------
  // PAGINATION
  // --------------------------------------------------

  loadMoreImages: async () => {
    const state = get();

    console.log("[Gallery] loadMoreImages called", {
      page: state.page,

      images: state.images.length,

      isLoading: state.isLoading,

      isLoadingMore: state.isLoadingMore,

      isRefreshing: state.isRefreshing,

      hasMore: state.hasMore,
    });

    // Don't paginate while initial loading
    if (state.isLoading) {
      console.log("[Gallery] Pagination skipped - initial loading");

      return;
    }

    // Don't start two pagination requests
    if (state.isLoadingMore) {
      console.log("[Gallery] Pagination skipped - already loading more");

      return;
    }

    // Don't paginate while refreshing
    if (state.isRefreshing) {
      console.log("[Gallery] Pagination skipped - refresh in progress");

      return;
    }

    // No more pages
    if (!state.hasMore) {
      console.log("[Gallery] Pagination skipped - no more images");

      return;
    }

    const nextPage = state.page + 1;

    console.log(`[Gallery] Loading page ${nextPage}`);

    // IMPORTANT:
    // Pagination uses isLoadingMore,
    // NOT isLoading.
    set({
      isLoadingMore: true,
      error: null,
    });

    try {
      const newImages = await api.fetchImages(nextPage, 20);

      console.log(
        `[Gallery] Page ${nextPage} returned ${newImages.length} images`,
      );

      // Get the CURRENT state after
      // the async API request.
      const currentImages = get().images;

      const existingIds = new Set(currentImages.map((image) => image.id));

      const uniqueImages = newImages.filter(
        (image) => !existingIds.has(image.id),
      );

      console.log(
        `[Gallery] Existing: ${currentImages.length}, New unique: ${uniqueImages.length}`,
      );

      const updatedImages = [...currentImages, ...uniqueImages];

      set({
        images: updatedImages,

        page: nextPage,

        hasMore: newImages.length === 20,

        isLoadingMore: false,

        error: null,
      });

      console.log(`[Gallery] Total images: ${updatedImages.length}`);
    } catch (error: any) {
      console.error("[Gallery] Pagination error:", error);

      set({
        error: error?.message || "Failed to load more images",

        isLoadingMore: false,
      });
    }
  },

  // --------------------------------------------------
  // PULL TO REFRESH
  // --------------------------------------------------

  refreshImages: async () => {
    const state = get();

    console.log("[Gallery] refreshImages CALLED", {
      currentImages: state.images.length,

      page: state.page,

      isLoading: state.isLoading,

      isLoadingMore: state.isLoadingMore,

      isRefreshing: state.isRefreshing,
    });

    // Already refreshing
    if (state.isRefreshing) {
      console.log("[Gallery] Refresh skipped - already refreshing");

      return;
    }

    // Don't refresh during initial load
    if (state.isLoading) {
      console.log("[Gallery] Refresh skipped - initial loading");

      return;
    }

    // Don't refresh during pagination
    if (state.isLoadingMore) {
      console.log("[Gallery] Refresh skipped - pagination in progress");

      return;
    }

    set({
      isRefreshing: true,
      error: null,
    });

    try {
      const [fetchedImages, storedFavorites] = await Promise.all([
        api.fetchImages(1, 20),
        storage.getFavorites(),
      ]);

      set({
        images: fetchedImages,

        favorites: storedFavorites,

        page: 1,

        hasMore: fetchedImages.length === 20,

        isRefreshing: false,

        error: null,
      });

      console.log(`[Gallery] Refresh complete: ${fetchedImages.length} images`);
    } catch (error: any) {
      console.error("[Gallery] Refresh error:", error);

      set({
        error: error?.message || "Failed to refresh images",

        isRefreshing: false,
      });
    }
  },

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  setSearchQuery: (query: string) => {
    set({
      searchQuery: query,
    });
  },

  // --------------------------------------------------
  // AUTHOR FILTER
  // --------------------------------------------------

  setAuthorFilter: (filter: AuthorFilter) => {
    set({
      authorFilter: filter,
    });
  },

  // --------------------------------------------------
  // FAVORITES
  // --------------------------------------------------

  loadFavorites: async () => {
    try {
      const storedFavorites = await storage.getFavorites();

      set({
        favorites: storedFavorites,
      });
    } catch (error) {
      console.error("[Gallery] Failed to load favorites:", error);
    }
  },

  // --------------------------------------------------
  // TOGGLE FAVORITE
  // --------------------------------------------------

  toggleFavorite: async (imageId: string) => {
    const currentFavorites = get().favorites;

    let updatedFavorites: string[];

    if (currentFavorites.includes(imageId)) {
      updatedFavorites = currentFavorites.filter((id) => id !== imageId);
    } else {
      updatedFavorites = [...currentFavorites, imageId];
    }

    // Immediate UI update
    set({
      favorites: updatedFavorites,
    });

    try {
      await storage.setFavorites(updatedFavorites);
    } catch (error) {
      console.error("[Gallery] Failed to save favorite:", error);
    }
  },

  // --------------------------------------------------
  // CHECK FAVORITE
  // --------------------------------------------------

  isFavorite: (imageId: string) => {
    return get().favorites.includes(imageId);
  },
}));
