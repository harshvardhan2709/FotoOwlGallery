import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library/legacy';
import * as Sharing from 'expo-sharing';
import { PicsumImage } from '@/types/image';

export const mediaService = {
  /**
   * Downloads a high-resolution image and saves it to the device's native media gallery.
   * Handles permissions, fallback downloads, native sharing fallback, and user alerts.
   */
  async downloadAndSaveImage(imageData: PicsumImage): Promise<boolean> {
    const downloadUrl =
      imageData.download_url || `https://picsum.photos/id/${imageData.id}/1200/800`;
    const fileUri = `${FileSystem.documentDirectory}fotoowl_${imageData.id}.jpg`;

    try {
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri);
      const permission = await MediaLibrary.requestPermissionsAsync();

      if (permission.granted) {
        await MediaLibrary.createAssetAsync(downloadResult.uri);
        Alert.alert(
          'Photo Saved!',
          'The high-resolution photo has been saved directly to your device gallery.'
        );
        return true;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
        return true;
      }

      Alert.alert(
        'Downloaded Locally',
        'Image downloaded to local app storage. Permission to save to device gallery was not granted.'
      );
      return true;
    } catch (error: any) {
      console.error('[mediaService] Primary download failed, trying fallback:', error);
      try {
        const fallbackUrl = `https://picsum.photos/id/${imageData.id}/800/600`;
        const fallbackUri = `${FileSystem.documentDirectory}fotoowl_${imageData.id}_fallback.jpg`;
        const fallbackResult = await FileSystem.downloadAsync(fallbackUrl, fallbackUri);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fallbackResult.uri);
          return true;
        }

        Alert.alert('Download Completed', 'Saved to local app cache.');
        return true;
      } catch (fallbackError) {
        console.error('[mediaService] Fallback download error:', fallbackError);
        Alert.alert(
          'Download Error',
          'Could not save image to gallery. Please check your internet connection and try again.'
        );
        return false;
      }
    }
  },

  /**
   * Downloads a temporary file and triggers native sharing.
   */
  async shareImage(imageData: PicsumImage): Promise<boolean> {
    const fullResolutionUrl =
      imageData.download_url || `https://picsum.photos/id/${imageData.id}/1200/800`;

    try {
      if (await Sharing.isAvailableAsync()) {
        const fileUri = `${FileSystem.documentDirectory}fotoowl_share_${imageData.id}.jpg`;
        const downloadResult = await FileSystem.downloadAsync(fullResolutionUrl, fileUri);
        await Sharing.shareAsync(downloadResult.uri);
        return true;
      }

      Alert.alert('Share Link', `Direct photo URL: ${fullResolutionUrl}`);
      return true;
    } catch (error) {
      console.error('[mediaService] Share error:', error);
      Alert.alert('Share Error', 'Could not share image. Please try again.');
      return false;
    }
  },
};
