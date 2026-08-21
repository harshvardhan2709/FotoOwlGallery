import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ImageCard, SearchBar } from '@/components';
import { useSearch } from '@/hooks/useSearch';
import { useGalleryStore } from '@/store/galleryStore';
import { PicsumImage } from '@/types/image';

export default function FavoritesScreen() {
  const images = useGalleryStore((state) => state.images);
  const favorites = useGalleryStore((state) => state.favorites);
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const loadFavorites = useGalleryStore((state) => state.loadFavorites);
  const { searchQuery, debouncedQuery, setSearchQuery, clearSearch } = useSearch('', 300);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const favoriteImages = useMemo(() => {
    const favs = images.filter((img) => favorites.includes(img.id));
    if (!debouncedQuery.trim()) return favs;
    return favs.filter((img) =>
      img.author.toLowerCase().includes(debouncedQuery.trim().toLowerCase())
    );
  }, [images, favorites, debouncedQuery]);

  const renderItem = useCallback(
    ({ item }: { item: PicsumImage }) => (
      <ImageCard item={item} isFav={true} onToggleFavorite={toggleFavorite} />
    ),
    [toggleFavorite]
  );

  const renderEmpty = useCallback(() => (
    <View className="items-center justify-center py-12 px-6 bg-white rounded-2xl border border-slate-200/80 my-4">
      <View className="w-14 h-14 rounded-full bg-rose-50 items-center justify-center mb-3">
        <Ionicons name="heart-dislike-outline" size={28} color="#E53935" />
      </View>
      <Text className="text-lg font-bold text-slate-900">
        {searchQuery.trim() ? 'No Matching Favorites' : 'No Favorites Yet'}
      </Text>
      <Text className="text-sm text-slate-500 text-center mt-1.5 leading-5 px-4">
        {searchQuery.trim()
          ? `No favorited photos match "${debouncedQuery}".`
          : 'Tap the heart icon on any photo to save it here.'}
      </Text>
      {searchQuery.trim() ? (
        <TouchableOpacity
          className="mt-4 bg-slate-900 px-5 py-3 rounded-xl"
          onPress={clearSearch}
        >
          <Text className="text-white text-sm font-bold">Clear Search</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className="mt-4 bg-slate-900 px-5 py-3 rounded-xl"
          onPress={() => router.push('/(tabs)/home')}
        >
          <Text className="text-white text-sm font-bold">Browse Gallery</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchQuery, debouncedQuery, clearSearch]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Compact Header */}
      <View className="pb-2 px-4">
        <View className="flex-row items-center justify-between mb-2.5">
          <View className="flex-row items-center gap-2.5">
            <View className="w-9 h-9 rounded-xl bg-rose-500 items-center justify-center">
              <Ionicons name="heart" size={18} color="#FFFFFF" />
            </View>
            <Text className="text-xl font-black text-slate-900">Favorites</Text>
          </View>

          <View className="bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
            <Text className="text-xs font-bold text-rose-700">
              {favoriteImages.length} {favoriteImages.length === 1 ? 'item' : 'items'}
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={clearSearch}
          placeholder="Search favorites..."
        />
      </View>

      <FlatList
        data={favoriteImages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}