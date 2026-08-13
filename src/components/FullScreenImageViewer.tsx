import { PicsumImage } from '@/types/image';
import { mediaService } from '@/services/mediaService';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  // Reset loading state when modal becomes visible or image changes
  const [prevKey, setPrevKey] = useState<string | null>(null);
  const currentKey = visible && imageData ? imageData.id : null;

  if (currentKey !== prevKey) {
    setPrevKey(currentKey);
    if (currentKey !== null) {
      setImgLoading(true);
    }
  }

  if (!imageData) return null;

  const fullResolutionUrl = imageData.download_url || `https://picsum.photos/id/${imageData.id}/1200/800`;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await mediaService.downloadAndSaveImage(imageData);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    await mediaService.shareImage(imageData);
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
