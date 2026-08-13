import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FullScreenImageViewer } from '@/components/FullScreenImageViewer';
import { api } from '@/services/api';
import { mediaService } from '@/services/mediaService';
import { useGalleryStore } from '@/store/galleryStore';
import { PicsumImage } from '@/types/image';

export default function ImageDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { images, toggleFavorite, isFavorite } = useGalleryStore();

  const [imageData, setImageData] = useState<PicsumImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const favorited = id ? isFavorite(id) : false;

  useEffect(() => {
    const onBackPress = () => {
      if (isFullScreen) {
        setIsFullScreen(false);
        return true;
      }
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      router.replace('/(tabs)/home');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [isFullScreen]);

  useEffect(() => {
    if (!id) return;

    const existing = images.find((img) => img.id === id);
    if (existing) {
      setImageData(existing);
      setLoading(false);
    } else {
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
      await mediaService.downloadAndSaveImage(imageData);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white" edges={['top']}>
        <ActivityIndicator size="large" color="#0F172A" />
        <Text className="mt-3 text-sm font-semibold text-slate-500">Loading photo details...</Text>
      </SafeAreaView>
    );
  }

  if (!imageData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white" edges={['top']}>
        <Ionicons name="alert-circle-outline" size={48} color="#E53935" />
        <Text className="text-lg font-bold text-slate-900 mt-3">Photo Not Found</Text>
        <TouchableOpacity className="mt-4 bg-slate-900 px-5 py-3 rounded-xl" onPress={() => router.back()}>
          <Text className="text-white text-sm font-bold">Go Back to Gallery</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const aspectRatio = (imageData.width / imageData.height).toFixed(2);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white border-b border-slate-200/80">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/home');
            }
          }}
        >
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text className="text-base font-bold text-slate-900">Photo Details</Text>

        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center"
          onPress={() => id && toggleFavorite(id)}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? '#E53935' : '#0F172A'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Details Card */}
        <View className="mt-22">
          <View className="m-4  bg-white rounded-2xl p-14 border border-slate-200/80 shadow-sm ">
            {/* Photographer Information */}
            <View className="flex-row items-center gap-3.5">
              <View className="w-12 h-12 rounded-2xl bg-slate-900 items-center justify-center shadow-sm">
                <Ionicons name="camera" size={22} color="#FFFFFF" />
              </View>

              <View className="flex-1">
                <Text className="text-xs text-slate-400 font-bold uppercase tracking-wider">Photographer</Text>
                <Text className="text-lg font-black text-slate-900 mt-0.5">{imageData.author}</Text>
              </View>
            </View>

            <View className="h-px bg-slate-100 my-4" />

            {/* Specs Grid */}
            <Text className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Photo Specs</Text>

            <View className="flex-row gap-2.5 mb-5">
              <View className="flex-1 bg-slate-50 rounded-2xl p-3 items-center border border-slate-200/70">
                <Ionicons name="resize-outline" size={18} color="#64748B" />
                <Text className="text-xs font-semibold text-slate-400 mt-1">Width</Text>
                <Text className="text-sm font-black text-slate-900 mt-0.5">{imageData.width} px</Text>
              </View>

              <View className="flex-1 bg-slate-50 rounded-2xl p-3 items-center border border-slate-200/70">
                <Ionicons name="swap-vertical-outline" size={18} color="#64748B" />
                <Text className="text-xs font-semibold text-slate-400 mt-1">Height</Text>
                <Text className="text-sm font-black text-slate-900 mt-0.5">{imageData.height} px</Text>
              </View>

              <View className="flex-1 bg-slate-50 rounded-2xl p-3 items-center border border-slate-200/70">
                <Ionicons name="crop-outline" size={18} color="#64748B" />
                <Text className="text-xs font-semibold text-slate-400 mt-1">Ratio</Text>
                <Text className="text-sm font-black text-slate-900 mt-0.5">{aspectRatio}:1</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="gap-2.5">
              <TouchableOpacity
                className={`flex-row items-center justify-center gap-2.5 bg-slate-900 py-4 rounded-2xl shadow-sm ${downloading ? 'opacity-60' : ''
                  }`}
                onPress={handleDownload}
                disabled={downloading}
              >
                {downloading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                    <Text className="text-white text-sm font-black">Save to Device Gallery</Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center justify-center gap-2 bg-slate-100 py-3.5 rounded-2xl"
                onPress={() => setIsFullScreen(true)}
              >
                <Ionicons name="expand-outline" size={18} color="#0F172A" />
                <Text className="text-slate-900 text-sm font-bold">Open Lightbox Viewer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Lightbox Modal */}
      <FullScreenImageViewer
        visible={isFullScreen}
        imageData={imageData}
        onClose={() => setIsFullScreen(false)}
      />
    </SafeAreaView>
  );
}