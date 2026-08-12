import React from 'react';
import { Dimensions, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '@/types/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_PADDING = 16;
const COLUMN_GAP = 16;
const COLUMN_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;
const IMAGE_HEIGHT = COLUMN_WIDTH * 0.85;
const CARD_CONTENT_HEIGHT = 58;
export const CARD_HEIGHT = IMAGE_HEIGHT + CARD_CONTENT_HEIGHT;

export interface ImageCardProps {
  item: PicsumImage;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ImageCard = React.memo(({ item, isFav, onToggleFavorite }: ImageCardProps) => {
  const thumbnailUrl = `https://picsum.photos/id/${item.id}/400/300.jpg`;

  return (
    <View
      style={{ width: COLUMN_WIDTH, height: CARD_HEIGHT }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 relative shadow-sm"
    >
      <Pressable className="flex-1" onPress={() => router.push(`/image/${item.id}`)}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: COLUMN_WIDTH, height: IMAGE_HEIGHT }}
          className="bg-slate-100"
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        <View style={{ height: CARD_CONTENT_HEIGHT }} className="px-3 py-2 justify-center bg-white">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="camera-outline" size={14} color="#64748B" />
            <Text className="text-xs font-bold text-slate-900 flex-1" numberOfLines={1}>
              {item.author}
            </Text>
          </View>

          <View className="flex-row items-center justify-between mt-1">
            <Text className="text-[11px] font-medium text-slate-400">
              #{item.id} · {item.width}×{item.height}
            </Text>
          </View>
        </View>
      </Pressable>

      <TouchableOpacity
        className="absolute top-2 right-2 bg-black/50 rounded-full p-2 items-center justify-center z-10"
        onPress={() => onToggleFavorite(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name={isFav ? 'heart' : 'heart-outline'} size={18} color={isFav ? '#E53935' : '#FFFFFF'} />
      </TouchableOpacity>
    </View>
  );
});
