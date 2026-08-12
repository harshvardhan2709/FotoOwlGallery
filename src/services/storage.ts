import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/auth";

const STORAGE_KEYS = {
  USER: "@fotowl/user",
  SESSION: "@fotowl/session",
  FAVORITES: "@fotowl/favorites",
};

export const storage = {
  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async setSession(isAuthenticated: boolean): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSION,
      JSON.stringify(isAuthenticated),
    );
  },

  async getSession(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);
      return data ? JSON.parse(data) : false;
    } catch {
      return false;
    }
  },

  async clearSession(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  async setFavorites(favorites: string[]): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites),
    );
  },

  async getFavorites(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
};
