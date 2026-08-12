import React from 'react';
import { Dimensions, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { PicsumImage } from '@/types/image';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMN_WIDTH = (SCREEN_WIDTH - 48) / 2;

export interface FavoriteCardProps {
  item: PicsumImage;
  onToggleFavorite: (id: string) => void;
}

export const FavoriteCard = React.memo(({ item, onToggleFavorite }: FavoriteCardProps) => {
  const thumbnailUrl = `https://picsum.photos/id/${item.id}/400/300.jpg`;

  return (
    <View
      style={{ width: COLUMN_WIDTH }}
      className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative"
    >
      <Pressable
        className="flex-1 active:opacity-90"
        onPress={() => router.push(`/image/${item.id}`)}
      >
        <Image
          source={{ uri: thumbnailUrl }}
          style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH * 0.85 }}
          className="bg-slate-100"
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
        />

        <View className="px-3 py-2.5">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="camera-outline" size={14} color="#64748B" />
            <Text className="text-sm font-bold text-slate-900 flex-1" numberOfLines={1}>
              {item.author}
            </Text>
          </View>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">
            {item.width} × {item.height}
          </Text>
        </View>
      </Pressable>

      <TouchableOpacity
        className="absolute top-2 right-2 bg-black/50 rounded-full p-1.5 items-center justify-center z-10"
        onPress={() => onToggleFavorite(item.id)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="heart" size={18} color="#E53935" />
      </TouchableOpacity>
    </View>
  );
});
