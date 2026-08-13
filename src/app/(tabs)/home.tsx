import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useGalleryStore } from "@/store/galleryStore";
import { useDebounce } from "@/hooks/useDebounce";
import { AuthorFilter, PicsumImage, SortOrder } from "@/types/image";
import { ImageCard, SearchBar, FilterPills } from "@/components";

const HORIZONTAL_PADDING = 16;

const AUTHOR_FILTERS: {
  label: string;
  value: AuthorFilter;
}[] = [
  {
    label: "All",
    value: "ALL",
  },
  {
    label: "A – M",
    value: "A-M",
  },
  {
    label: "N – Z",
    value: "N-Z",
  },
];

const SORT_OPTIONS: {
  label: string;
  value: SortOrder;
}[] = [
  {
    label: "Default",
    value: "NONE",
  },
  {
    label: "Author A → Z",
    value: "A-Z",
  },
  {
    label: "Author Z → A",
    value: "Z-A",
  },
];

// ==================================================
// HOME SCREEN
// ==================================================

export default function HomeScreen() {
  const images = useGalleryStore((state) => state.images);
  const favorites = useGalleryStore((state) => state.favorites);

  const isLoading = useGalleryStore((state) => state.isLoading);
  const isLoadingMore = useGalleryStore((state) => state.isLoadingMore);
  const isRefreshing = useGalleryStore((state) => state.isRefreshing);

  const error = useGalleryStore((state) => state.error);

  const searchQuery = useGalleryStore((state) => state.searchQuery);
  const authorFilter = useGalleryStore((state) => state.authorFilter);
  const sortOrder = useGalleryStore((state) => state.sortOrder);

  const loadInitialImages = useGalleryStore((state) => state.loadInitialImages);
  const loadMoreImages = useGalleryStore((state) => state.loadMoreImages);
  const refreshImages = useGalleryStore((state) => state.refreshImages);

  const setSearchQuery = useGalleryStore((state) => state.setSearchQuery);
  const setAuthorFilter = useGalleryStore((state) => state.setAuthorFilter);
  const setSortOrder = useGalleryStore((state) => state.setSortOrder);

  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);

  const flatListRef = useRef<FlatList<PicsumImage>>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    loadInitialImages();
  }, [loadInitialImages]);

  // ==================================================
  // SEARCH + FILTER + SORT PIPELINE
  // ==================================================

  const filteredImages = useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();

    // 1. Search + Filter
    const filtered = images.filter((image) => {
      const author = image.author.trim().toLowerCase();

      const matchesSearch =
        query.length === 0 || author.includes(query);

      const firstLetter = author.charAt(0).toUpperCase();

      let matchesAuthorFilter = true;

      if (authorFilter === "A-M") {
        matchesAuthorFilter =
          firstLetter >= "A" && firstLetter <= "M";
      } else if (authorFilter === "N-Z") {
        matchesAuthorFilter =
          firstLetter >= "N" && firstLetter <= "Z";
      }

      return matchesSearch && matchesAuthorFilter;
    });

    // 2. Sort (non-destructive)
    if (sortOrder === "A-Z") {
      return [...filtered].sort((a, b) =>
        a.author.localeCompare(b.author, undefined, { sensitivity: "base" })
      );
    }

    if (sortOrder === "Z-A") {
      return [...filtered].sort((a, b) =>
        b.author.localeCompare(a.author, undefined, { sensitivity: "base" })
      );
    }

    return filtered;
  }, [
    images,
    debouncedSearchQuery,
    authorFilter,
    sortOrder,
  ]);

  // ==================================================
  // PAGINATION
  // ==================================================

  const handleLoadMore = useCallback(() => {
    if (isLoading || isLoadingMore || isRefreshing) {
      return;
    }

    loadMoreImages();
  }, [
    isLoading,
    isLoadingMore,
    isRefreshing,
    loadMoreImages,
  ]);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh = useCallback(async () => {
    if (isRefreshing || isLoadingMore) {
      return;
    }

    await refreshImages();

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToOffset({
        offset: 0,
        animated: false,
      });
    });
  }, [
    isRefreshing,
    isLoadingMore,
    refreshImages,
  ]);

  // ==================================================
  // FOOTER
  // ==================================================

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) {
      return null;
    }

    return (
      <View className="py-6 items-center">
        <ActivityIndicator
          size="small"
          color="#0F172A"
        />

        <Text className="text-sm text-slate-500 font-medium mt-2">
          Loading more photos...
        </Text>
      </View>
    );
  }, [isLoadingMore]);

  // ==================================================
  // EMPTY STATE
  // ==================================================

  const renderEmpty = useCallback(() => {
    if (isLoading && images.length === 0) {
      return (
        <View className="items-center justify-center py-16">
          <ActivityIndicator
            size="large"
            color="#0F172A"
          />

          <Text className="text-base font-medium text-slate-500 mt-3">
            Loading gallery...
          </Text>
        </View>
      );
    }

    return (
      <View className="items-center justify-center py-12 px-6">
        <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-3">
          <Ionicons
            name="images-outline"
            size={32}
            color="#94A3B8"
          />
        </View>

        <Text className="text-lg font-bold text-slate-900">
          No Results Found
        </Text>

        <Text className="text-sm text-slate-500 text-center mt-2">
          No photographers match your current search, filter, or sort options.
        </Text>

        {(searchQuery.length > 0 ||
          authorFilter !== "ALL" ||
          sortOrder !== "NONE") && (
          <TouchableOpacity
            className="mt-4 bg-slate-900 px-5 py-3 rounded-xl"
            onPress={() => {
              setSearchQuery("");
              setAuthorFilter("ALL");
              setSortOrder("NONE");
            }}
          >
            <Text className="text-white font-bold">
              Reset Filters & Sort
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [
    isLoading,
    images.length,
    searchQuery,
    authorFilter,
    sortOrder,
    setSearchQuery,
    setAuthorFilter,
    setSortOrder,
  ]);

  // ==================================================
  // ITEM
  // ==================================================

  const renderImageItem = useCallback(
    ({ item }: { item: PicsumImage }) => (
      <ImageCard
        item={item}
        isFav={favorites.includes(item.id)}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [favorites, toggleFavorite]
  );

  // ==================================================
  // KEY
  // ==================================================

  const keyExtractor = useCallback(
    (item: PicsumImage) => item.id,
    []
  );

  // ==================================================
  // HEADER
  // ==================================================

  const listHeader = useMemo(
    () => (
      <View className="pt-1 pb-2 bg-slate-50">
        {/* BRAND */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2.5">
            <View className="w-9 h-9 rounded-xl bg-slate-900 items-center justify-center">
              <Ionicons
                name="images"
                size={18}
                color="#FFFFFF"
              />
            </View>

            <Text className="text-xl font-black text-slate-900">
              FotoOwl
            </Text>
          </View>

          <View className="bg-slate-200/80 px-2.5 py-1 rounded-full">
            <Text className="text-xs font-bold text-slate-600">
              {filteredImages.length} photos
            </Text>
          </View>
        </View>

        {/* SEARCH */}
        <View className="mb-2.5">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Search by photographer..."
          />
        </View>

        {/* AUTHOR FILTERS */}
        <View className="mb-1">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Author Initial Filter
          </Text>
          <FilterPills
            options={AUTHOR_FILTERS}
            selectedValue={authorFilter}
            onSelect={setAuthorFilter}
          />
        </View>

        {/* SORTING OPTIONS */}
        <View className="mt-2 mb-1">
          <Text className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Alphabetical Sorting
          </Text>
          <FilterPills
            options={SORT_OPTIONS}
            selectedValue={sortOrder}
            onSelect={setSortOrder}
          />
        </View>

        {/* ERROR */}
        {error && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-3 mt-2 flex-row items-center">
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#E53935"
            />

            <Text className="text-red-700 flex-1 ml-2">
              {error}
            </Text>

            <TouchableOpacity
              className="bg-red-700 px-3 py-1.5 rounded-lg"
              onPress={() => loadInitialImages(true)}
            >
              <Text className="text-white font-bold">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    ),
    [
      filteredImages.length,
      searchQuery,
      authorFilter,
      sortOrder,
      error,
      setSearchQuery,
      setAuthorFilter,
      setSortOrder,
      loadInitialImages,
    ]
  );

  // ==================================================
  // SCREEN
  // ==================================================

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={["top"]}
    >
      <FlatList
        ref={flatListRef}
        data={filteredImages}
        renderItem={renderImageItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: 12,
        }}
        ListHeaderComponent={listHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#0F172A"
          />
        }
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}