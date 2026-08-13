import React from 'react';
import { ImageCard, ImageCardProps } from './ImageCard';

export interface FavoriteCardProps {
  item: ImageCardProps['item'];
  onToggleFavorite: ImageCardProps['onToggleFavorite'];
}

/**
 * @deprecated Use ImageCard directly with isFav={true}
 */
const FavoriteCard = ({ item, onToggleFavorite }: FavoriteCardProps) => (
  <ImageCard item={item} isFav={true} onToggleFavorite={onToggleFavorite} />
);

FavoriteCard.displayName = 'FavoriteCard';
export const MemoizedFavoriteCard = React.memo(FavoriteCard);
