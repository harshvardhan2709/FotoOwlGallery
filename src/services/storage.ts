import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  USER: "@fotowl/user",
  SESSION: "@fotowl/session",
  FAVORITES: "@fotowl/favorites",
};

export const storage = {
  async setUser(user: unknown) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  async getUser() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);

    return data ? JSON.parse(data) : null;
  },

  async setSession(isAuthenticated: boolean) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.SESSION,
      JSON.stringify(isAuthenticated),
    );
  },

  async getSession() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);

    return data ? JSON.parse(data) : false;
  },

  async clearSession() {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION);
  },

  async setFavorites(favorites: string[]) {
    await AsyncStorage.setItem(
      STORAGE_KEYS.FAVORITES,
      JSON.stringify(favorites),
    );
  },

  async getFavorites(): Promise<string[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);

    return data ? JSON.parse(data) : [];
  },
};
