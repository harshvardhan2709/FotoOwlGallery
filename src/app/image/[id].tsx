import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';


import { api } from '@/services/api';
import { useGalleryStore } from '@/store/galleryStore';
import { PicsumImage } from '@/types/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ImageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { images, toggleFavorite, isFavorite } = useGalleryStore();

  const [imageData, setImageData] = useState<PicsumImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const favorited = id ? isFavorite(id) : false;

  useEffect(() => {
    if (!id) return;

    // Check if we already have the image in our gallery store
    const existing = images.find((img) => img.id === id);
    if (existing) {
      setImageData(existing);
      setLoading(false);
    } else {
      // Fetch directly from API
      setLoading(true);
      api
        .fetchImageById(id)
        .then((data) => {
          setImageData(data);
        })
        .catch((err) => {
          console.error('Failed to fetch image details:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, images]);

  const handleDownload = async () => {
    if (!imageData) return;

    try {
      setDownloading(true);

      const imageUrl = `https://picsum.photos/id/${imageData.id}/${imageData.width}/${imageData.height}`;
      const fileUri = `${FileSystem.documentDirectory}fotoowl_${imageData.id}.jpg`;

      // 1. Download image file to local cache
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      // 2. Request Media Library permission to save image to device gallery
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        await MediaLibrary.createAssetAsync(downloadResult.uri);
        Alert.alert(
          'Image Saved! 📸',
          'The photo has been saved directly to your device photo gallery.'
        );
      } else {
        // Fallback to Expo Sharing sheet if media library permission is denied
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert(
            'Downloaded',
            'Image downloaded locally, but permission to save to Gallery was denied.'
          );
        }
      }
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert('Download Error', 'Could not save image to gallery. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111111" />
        <Text style={styles.loadingText}>Loading image details...</Text>
      </SafeAreaView>
    );
  }

  if (!imageData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
        <Text style={styles.errorText}>Image not found</Text>
        <TouchableOpacity style={styles.backButtonInline} onPress={() => router.back()}>
          <Text style={styles.backButtonInlineText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const fullResolutionUrl = `https://picsum.photos/id/${imageData.id}/1200/800`;
  const aspectRatio = (imageData.width / imageData.height).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Photo #{imageData.id}
        </Text>

        <TouchableOpacity
          style={styles.iconCircle}
          onPress={() => id && toggleFavorite(id)}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? '#E53935' : '#111111'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Full Image Preview */}
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: fullResolutionUrl }}
            style={styles.fullImage}
            contentFit="cover"
            transition={300}
          />
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.authorRow}>
            <View style={styles.authorAvatar}>
              <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.authorTitle}>Author</Text>
              <Text style={styles.authorName}>{imageData.author}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Specs Grid */}
          <Text style={styles.specSectionTitle}>Image Specifications</Text>

          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Ionicons name="resize-outline" size={18} color="#718096" />
              <Text style={styles.specLabel}>Width</Text>
              <Text style={styles.specValue}>{imageData.width} px</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="swap-vertical-outline" size={18} color="#718096" />
              <Text style={styles.specLabel}>Height</Text>
              <Text style={styles.specValue}>{imageData.height} px</Text>
            </View>

            <View style={styles.specItem}>
              <Ionicons name="crop-outline" size={18} color="#718096" />
              <Text style={styles.specLabel}>Aspect Ratio</Text>
              <Text style={styles.specValue}>{aspectRatio}:1</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.downloadButton, downloading && styles.buttonDisabled]}
              onPress={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.downloadButtonText}>Download to Device</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    marginTop: 12,
  },
  backButtonInline: {
    marginTop: 16,
    backgroundColor: '#111111',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonInlineText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F7FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A202C',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imagePreviewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 0.75,
    backgroundColor: '#1A202C',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorTitle: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '600',
  },
  authorName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A202C',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#EDF2F7',
    marginVertical: 16,
  },
  specSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 12,
  },
  specGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  specItem: {
    flex: 1,
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  specLabel: {
    fontSize: 11,
    color: '#718096',
    marginTop: 4,
  },
  specValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A202C',
    marginTop: 2,
  },
  actionRow: {
    gap: 12,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});