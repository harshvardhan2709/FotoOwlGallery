import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/auth";

const STORAGE_KEYS = {
  USER: "@fotowl/user",
  USERS_LIST: "@fotowl/users_list",
  SESSION: "@fotowl/session",
  FAVORITES_PREFIX: "@fotowl/favorites_",
  LEGACY_FAVORITES: "@fotowl/favorites",
};

export const storage = {
  async getUsers(): Promise<User[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS_LIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async setUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    const users = await this.getUsers();
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === user.email.toLowerCase()
    );
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.USERS_LIST, JSON.stringify(users));
  },

  async getUser(email?: string): Promise<User | null> {
    try {
      if (email) {
        const users = await this.getUsers();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        if (found) return found;
      }
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      const activeUser = data ? JSON.parse(data) : null;
      if (email && activeUser && activeUser.email.toLowerCase() !== email.toLowerCase()) {
        return null;
      }
      return activeUser;
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

  async setFavorites(favorites: string[], userEmail?: string): Promise<void> {
    let email = userEmail;
    if (!email) {
      const activeUser = await this.getUser();
      email = activeUser?.email;
    }
    const key = email
      ? `${STORAGE_KEYS.FAVORITES_PREFIX}${email.toLowerCase()}`
      : STORAGE_KEYS.LEGACY_FAVORITES;

    await AsyncStorage.setItem(key, JSON.stringify(favorites));
  },

  async getFavorites(userEmail?: string): Promise<string[]> {
    try {
      let email = userEmail;
      if (!email) {
        const activeUser = await this.getUser();
        email = activeUser?.email;
      }
      const key = email
        ? `${STORAGE_KEYS.FAVORITES_PREFIX}${email.toLowerCase()}`
        : STORAGE_KEYS.LEGACY_FAVORITES;

      const data = await AsyncStorage.getItem(key);
      if (data) return JSON.parse(data);

      return [];
    } catch {
      return [];
    }
  },
};
