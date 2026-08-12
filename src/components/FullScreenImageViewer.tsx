import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library/legacy';
import * as Sharing from 'expo-sharing';
import { PicsumImage } from '@/types/image';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface FullScreenImageViewerProps {
  visible: boolean;
  imageData: PicsumImage | null;
  onClose: () => void;
}

export const FullScreenImageViewer: React.FC<FullScreenImageViewerProps> = ({
  visible,
  imageData,
  onClose,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);

  if (!imageData) return null;

  const fullResolutionUrl = imageData.download_url || `https://picsum.photos/id/${imageData.id}/1200/800`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const fileUri = `${FileSystem.documentDirectory}fotoowl_${imageData.id}_full.jpg`;
      const downloadResult = await FileSystem.downloadAsync(fullResolutionUrl, fileUri);
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (permission.granted) {
        await MediaLibrary.createAssetAsync(downloadResult.uri);
        Alert.alert('Saved to Gallery 📸', 'The photo has been saved to your device gallery.');
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadResult.uri);
        } else {
          Alert.alert('Downloaded', 'Photo downloaded to app local storage.');
        }
      }
    } catch (err: any) {
      console.error('Download error:', err);
      try {
        const fallbackUrl = `https://picsum.photos/id/${imageData.id}/800/600`;
        const fileUri = `${FileSystem.documentDirectory}fotoowl_${imageData.id}_alt.jpg`;
        const res = await FileSystem.downloadAsync(fallbackUrl, fileUri);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(res.uri);
        }
      } catch (e) {
        Alert.alert('Download Error', 'Could not save image to gallery. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        const fileUri = `${FileSystem.documentDirectory}fotoowl_share_${imageData.id}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(fullResolutionUrl, fileUri);
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Share', `Share link: https://picsum.photos/id/${imageData.id}/800/600`);
      }
    } catch (err: any) {
      console.error('Share error:', err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View className="flex-1 bg-black justify-between">
        <SafeAreaView edges={['top']} className="z-20 bg-black/40">
          <View className="flex-row items-center justify-between px-4 py-3">
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View className="items-center">
              <Text className="text-white text-base font-bold" numberOfLines={1}>
                {imageData.author}
              </Text>
              <Text className="text-slate-400 text-xs font-semibold">
                {imageData.width} × {imageData.height}
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleShare}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
            >
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Full Image Container */}
        <View className="flex-1 justify-center items-center relative">
          <Image
            source={{ uri: fullResolutionUrl }}
            style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.75 }}
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
            onLoadEnd={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
          />

          {imgLoading && (
            <View pointerEvents="none" className="absolute inset-0 items-center justify-center z-10">
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Bottom Actions Bar */}
        <SafeAreaView edges={['bottom']} className="z-20 bg-black/40">
          <View className="p-4 flex-row gap-3">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-white py-3.5 rounded-2xl"
              onPress={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <ActivityIndicator color="#000000" size="small" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color="#000000" />
                  <Text className="text-black text-sm font-bold">Save to Gallery</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 bg-white/20 border border-white/30 py-3.5 rounded-2xl"
              onPress={onClose}
            >
              <Text className="text-white text-sm font-bold">Close Viewer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};
