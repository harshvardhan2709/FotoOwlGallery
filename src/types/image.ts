export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type AuthorFilter = "ALL" | "A-M" | "N-Z";

export interface GalleryState {
  images: PicsumImage[];
  favorites: string[];

  page: number;
  hasMore: boolean;

  // Initial gallery loading
  isLoading: boolean;

  // Loading the next pagination page
  isLoadingMore: boolean;

  // Pull-to-refresh
  isRefreshing: boolean;

  error: string | null;

  searchQuery: string;
  authorFilter: AuthorFilter;

  loadInitialImages: (force?: boolean) => Promise<void>;
  loadMoreImages: () => Promise<void>;
  refreshImages: () => Promise<void>;

  setSearchQuery: (query: string) => void;
  setAuthorFilter: (filter: AuthorFilter) => void;

  toggleFavorite: (imageId: string) => Promise<void>;
  loadFavorites: () => Promise<void>;

  isFavorite: (imageId: string) => boolean;
}
