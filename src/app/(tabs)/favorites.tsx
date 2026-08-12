import React, { useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useGalleryStore } from '@/store/galleryStore';
import { PicsumImage } from '@/types/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 36) / 2;

export default function FavoritesScreen() {
  const { images, favorites, toggleFavorite, loadFavorites } = useGalleryStore();

  useEffect(() => {
    loadFavorites();
  }, []);

  // Filter favorited images
  const favoriteImages = images.filter((img) => favorites.includes(img.id));

  const renderItem = ({ item }: { item: PicsumImage }) => {
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

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons name="heart" size={20} color="#E53935" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={56} color="#CBD5E0" />
      <Text style={styles.emptyTitle}>No Favorite Images</Text>
      <Text style={styles.emptyText}>
        Tap the heart icon on any image card to save it to your personal favorites collection.
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={styles.exploreText}>Explore Gallery</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Collection</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteImages.length} {favoriteImages.length === 1 ? 'image' : 'images'} saved
        </Text>
      </View>

      <FlatList
        data={favoriteImages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={renderEmpty}
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2D3748',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  exploreButton: {
    marginTop: 20,
    backgroundColor: '#111111',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  exploreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});