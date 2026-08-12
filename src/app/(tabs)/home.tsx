import React, { useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useGalleryStore } from '@/store/galleryStore';
import { AuthorFilter, PicsumImage } from '@/types/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 36) / 2;

const AUTHOR_FILTERS: { label: string; value: AuthorFilter }[] = [
  { label: 'All Authors', value: 'ALL' },
  { label: 'A - M', value: 'A-M' },
  { label: 'N - Z', value: 'N-Z' },
];

export default function HomeScreen() {
  const {
    images,
    isLoading,
    isRefreshing,
    hasMore,
    error,
    searchQuery,
    authorFilter,
    loadInitialImages,
    loadMoreImages,
    refreshImages,
    setSearchQuery,
    setAuthorFilter,
    toggleFavorite,
    isFavorite,
  } = useGalleryStore();

  useEffect(() => {
    loadInitialImages();
  }, []);

  // Filter images by search query (case-insensitive author search) & A-M/N-Z filter
  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const authorName = img.author.trim();
      const firstChar = authorName.charAt(0).toUpperCase();

      // Author filter matching
      let matchesFilter = true;
      if (authorFilter === 'A-M') {
        matchesFilter = firstChar >= 'A' && firstChar <= 'M';
      } else if (authorFilter === 'N-Z') {
        matchesFilter = firstChar >= 'N' && firstChar <= 'Z';
      }

      // Case-insensitive author search
      let matchesSearch = true;
      if (searchQuery.trim()) {
        matchesSearch = authorName
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase());
      }

      return matchesFilter && matchesSearch;
    });
  }, [images, searchQuery, authorFilter]);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.appTitle}>FotoOwl Gallery</Text>
      <Text style={styles.appSubtitle}>Discover photos from Picsum API</Text>

      {/* Case-insensitive Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by author name..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#888888" />
          </TouchableOpacity>
        )}
      </View>

      {/* Author Alphabetical Filter Segment (A-M / N-Z / All) */}
      <View style={styles.filterRow}>
        {AUTHOR_FILTERS.map((filter) => {
          const isActive = authorFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setAuthorFilter(filter.value)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadInitialImages}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (!isLoading || images.length === 0) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#111111" />
        <Text style={styles.footerLoaderText}>Loading more images...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading && images.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#111111" />
          <Text style={styles.emptyText}>Loading gallery...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="image-outline" size={48} color="#CCCCCC" />
        <Text style={styles.emptyTitle}>No Images Found</Text>
        <Text style={styles.emptyText}>
          No authors match "{searchQuery}" under filter ({authorFilter}).
        </Text>
        {(searchQuery.length > 0 || authorFilter !== 'ALL') && (
          <TouchableOpacity
            style={styles.resetFilterButton}
            onPress={() => {
              setSearchQuery('');
              setAuthorFilter('ALL');
            }}
          >
            <Text style={styles.resetFilterText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderImageItem = ({ item }: { item: PicsumImage }) => {
    const favorited = isFavorite(item.id);
    const thumbnailUrl = `https://picsum.photos/id/${item.id}/400/300`;

    return (
      <View style={styles.cardContainer}>
        <Pressable
          style={styles.cardPressable}
          onPress={() => router.push(`/image/${item.id}`)}
        >
          <Image
            source={{ uri: thumbnailUrl }}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />

          <View style={styles.cardInfo}>
            <Text style={styles.authorName} numberOfLines={1}>
              {item.author}
            </Text>
            <Text style={styles.imageDimensions}>
              {item.width} × {item.height}
            </Text>
          </View>
        </Pressable>

        {/* Favorite Button Overlay */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={20}
            color={favorited ? '#E53935' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id}
        renderItem={renderImageItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={loadMoreImages}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshImages}
            tintColor="#111111"
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    height: 48,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111111',
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  filterChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A5568',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  errorBox: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEB2B2',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#C53030',
    fontSize: 13,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#C53030',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardContainer: {
    width: COLUMN_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EDF2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  cardPressable: {
    flex: 1,
  },
  cardImage: {
    width: COLUMN_WIDTH,
    height: COLUMN_WIDTH * 0.75,
    backgroundColor: '#E2E8F0',
  },
  cardInfo: {
    padding: 10,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A202C',
  },
  imageDimensions: {
    fontSize: 11,
    color: '#718096',
    marginTop: 2,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 16,
    padding: 6,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLoaderText: {
    fontSize: 12,
    color: '#718096',
    marginTop: 6,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 6,
  },
  resetFilterButton: {
    marginTop: 16,
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetFilterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});