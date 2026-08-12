import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { Image } from "expo-image";

import { router } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import { useGalleryStore } from "@/store/galleryStore";
import { useDebounce } from "@/hooks/useDebounce";
import { AuthorFilter, PicsumImage } from "@/types/image";
import { ImageCard, SearchBar, FilterPills } from "@/components";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const HORIZONTAL_PADDING = 16;

const COLUMN_GAP = 16;

const COLUMN_WIDTH =
  (SCREEN_WIDTH -
    HORIZONTAL_PADDING * 2 -
    COLUMN_GAP) /
  2;

/*
 * Card structure:
 *
 * Image
 * + author row
 * + dimensions row
 *
 * Both columns intentionally have
 * the same fixed height.
 */
const IMAGE_HEIGHT =
  COLUMN_WIDTH * 0.85;

const CARD_CONTENT_HEIGHT = 58;

const CARD_HEIGHT =
  IMAGE_HEIGHT +
  CARD_CONTENT_HEIGHT;

/*
 * Distance from the beginning of one row
 * to the beginning of the next row.
 */
const ROW_HEIGHT =
  CARD_HEIGHT + 12;

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

// ==================================================
// HOME SCREEN
// ==================================================

export default function HomeScreen() {
  const {
    images,
    favorites,

    isLoading,
    isLoadingMore,
    isRefreshing,

    error,

    searchQuery,
    authorFilter,

    loadInitialImages,
    loadMoreImages,
    refreshImages,

    setSearchQuery,
    setAuthorFilter,

    toggleFavorite,
  } = useGalleryStore();

  const flatListRef = useRef<FlatList<PicsumImage>>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ==================================================
  // INITIAL LOAD
  // ==================================================

  useEffect(() => {
    console.log(
      "[Home] Initial effect fired"
    );

    loadInitialImages();
  }, []);

  // ==================================================
  // FILTER
  // ==================================================

  const filteredImages = useMemo(() => {
    const query =
      debouncedSearchQuery
        .trim()
        .toLowerCase();

    return images.filter(
      (image) => {
        const author =
          image.author
            .trim()
            .toLowerCase();

        const matchesSearch =
          query.length === 0 ||
          author.includes(query);

        const firstLetter =
          author
            .charAt(0)
            .toUpperCase();

        let matchesAuthorFilter =
          true;

        if (
          authorFilter === "A-M"
        ) {
          matchesAuthorFilter =
            firstLetter >= "A" &&
            firstLetter <= "M";
        }

        if (
          authorFilter === "N-Z"
        ) {
          matchesAuthorFilter =
            firstLetter >= "N" &&
            firstLetter <= "Z";
        }

        return (
          matchesSearch &&
          matchesAuthorFilter
        );
      }
    );
  }, [
    images,
    debouncedSearchQuery,
    authorFilter,
  ]);

  // ==================================================
  // PAGINATION
  // ==================================================

  const handleLoadMore =
    useCallback(() => {
      console.log(
        "[Home] onEndReached",
        {
          filteredCount:
            filteredImages.length,

          totalImages:
            images.length,

          isLoading,

          isLoadingMore,

          isRefreshing,
        }
      );

      if (isLoading) {
        return;
      }

      if (isLoadingMore) {
        return;
      }

      if (isRefreshing) {
        return;
      }

      loadMoreImages();
    }, [
      filteredImages.length,
      images.length,
      isLoading,
      isLoadingMore,
      isRefreshing,
      loadMoreImages,
    ]);

  // ==================================================
  // REFRESH
  // ==================================================

  const handleRefresh =
    useCallback(async () => {
      if (isRefreshing) {
        return;
      }

      if (isLoadingMore) {
        console.log(
          "[Home] Refresh blocked - pagination running"
        );

        return;
      }

      await refreshImages();

      requestAnimationFrame(() => {
        flatListRef.current?.scrollToOffset(
          {
            offset: 0,
            animated: false,
          }
        );
      });
    }, [
      isRefreshing,
      isLoadingMore,
      refreshImages,
    ]);

  // ==================================================
  // FOOTER
  // ==================================================

  const renderFooter =
    useCallback(() => {
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
    }, [
      isLoadingMore,
    ]);

  // ==================================================
  // EMPTY STATE
  // ==================================================

  const renderEmpty =
    useCallback(() => {
      if (
        isLoading &&
        images.length === 0
      ) {
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
            No photographers match
            your current search/filter.
          </Text>

          {(searchQuery.length >
            0 ||
            authorFilter !==
            "ALL") && (
              <TouchableOpacity
                className="mt-4 bg-slate-900 px-5 py-3 rounded-xl"
                onPress={() => {
                  setSearchQuery("");
                  setAuthorFilter(
                    "ALL"
                  );
                }}
              >
                <Text className="text-white font-bold">
                  Reset Filters
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
      setSearchQuery,
      setAuthorFilter,
    ]);

  // ==================================================
  // ITEM
  // ==================================================

  const renderImageItem =
    useCallback(
      ({
        item,
      }: {
        item: PicsumImage;
      }) => (
        <ImageCard
          item={item}
          isFav={favorites.includes(
            item.id
          )}
          onToggleFavorite={
            toggleFavorite
          }
        />
      ),
      [
        favorites,
        toggleFavorite,
      ]
    );

  // ==================================================
  // KEY
  // ==================================================

  const keyExtractor =
    useCallback(
      (item: PicsumImage) =>
        item.id,
      []
    );

  // ==================================================
  // GET ITEM LAYOUT
  // ==================================================

  /*
   * This is important.
   *
   * We have a 2-column grid where every card
   * has exactly the same height.
   *
   * Therefore FlatList can calculate exactly
   * where every row is located instead of
   * trying to measure/recycle rows dynamically.
   */

  const getItemLayout =
    useCallback(
      (
        _data:
          | ArrayLike<PicsumImage>
          | null
          | undefined,
        index: number
      ) => {
        const row =
          Math.floor(index / 2);

        return {
          length: ROW_HEIGHT,

          offset:
            ROW_HEIGHT * row,

          index,
        };
      },
      []
    );

  // ==================================================
  // HEADER
  // ==================================================

  const listHeader =
    useMemo(
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
                {
                  filteredImages.length
                }{" "}
                photos
              </Text>
            </View>
          </View>

          {/* SEARCH & FILTERS */}
          <View className="mb-2.5">
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search by photographer..."
            />
          </View>

          <FilterPills
            options={AUTHOR_FILTERS}
            selectedValue={authorFilter}
            onSelect={setAuthorFilter}
          />

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
                onPress={() =>
                  loadInitialImages(
                    true
                  )
                }
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
        error,
        setSearchQuery,
        setAuthorFilter,
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

        renderItem={
          renderImageItem
        }

        keyExtractor={
          keyExtractor
        }

        numColumns={2}

        columnWrapperStyle={{
          justifyContent:
            "space-between",

          marginBottom: 12,
        }}

        ListHeaderComponent={
          listHeader
        }

        ListFooterComponent={
          renderFooter
        }

        ListEmptyComponent={
          renderEmpty
        }

        // --------------------------------------------
        // PAGINATION
        // --------------------------------------------

        onEndReached={
          handleLoadMore
        }

        onEndReachedThreshold={
          0.5
        }

        // --------------------------------------------
        // FIXED ROW LAYOUT
        // --------------------------------------------

        getItemLayout={
          getItemLayout
        }

        // --------------------------------------------
        // VIRTUALIZATION
        // --------------------------------------------

        initialNumToRender={10}

        maxToRenderPerBatch={10}

        windowSize={10}

        updateCellsBatchingPeriod={50}

        removeClippedSubviews={false}

        // --------------------------------------------
        // REFRESH
        // --------------------------------------------

        refreshControl={
          <RefreshControl
            refreshing={
              isRefreshing
            }
            onRefresh={
              handleRefresh
            }
            tintColor="#0F172A"
          />
        }

        // --------------------------------------------
        // CONTENT
        // --------------------------------------------

        contentContainerStyle={{
          paddingHorizontal:
            HORIZONTAL_PADDING,

          paddingBottom: 24,
        }}

        showsVerticalScrollIndicator={
          false
        }
      />
    </SafeAreaView>
  );
}