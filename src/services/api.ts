import axios from 'axios';
import { PicsumImage } from '@/types/image';

const PICSUM_BASE_URL = 'https://picsum.photos';

export const api = {
  async fetchImages(page: number = 1, limit: number = 20): Promise<PicsumImage[]> {
    try {
      const response = await axios.get<PicsumImage[]>(
        `${PICSUM_BASE_URL}/v2/list?page=${page}&limit=${limit}`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching Picsum images (page ${page}):`, error);
      throw error;
    }
  },

  async fetchImageById(id: string): Promise<PicsumImage> {
    try {
      const response = await axios.get<PicsumImage>(
        `${PICSUM_BASE_URL}/id/${id}/info`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching image detail for ID ${id}:`, error);
      // Fallback object if info fails
      return {
        id,
        author: 'Unknown Author',
        width: 1920,
        height: 1080,
        url: `${PICSUM_BASE_URL}/id/${id}`,
        download_url: `${PICSUM_BASE_URL}/id/${id}/1920/1080`,
      };
    }
  },
};
