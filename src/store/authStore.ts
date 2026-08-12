import { create } from "zustand";

import { storage } from "@/services/storage";
import { AuthState, User } from "@/types/auth";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (user: User) => {
    await storage.setUser(user);

    set({
      user,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  login: async (email: string, password: string) => {
    const storedUser = await storage.getUser();

    if (!storedUser) {
      return false;
    }

    const credentialsValid =
      storedUser.email.toLowerCase() === email.toLowerCase() &&
      storedUser.password === password;

    if (!credentialsValid) {
      return false;
    }

    await storage.setSession(true);

    set({
      user: storedUser,
      isAuthenticated: true,
      isLoading: false,
    });

    return true;
  },

  logout: async () => {
    await storage.clearSession();

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  loadSession: async () => {
    try {
      const [user, isAuthenticated] = await Promise.all([
        storage.getUser(),
        storage.getSession(),
      ]);

      set({
        user,
        isAuthenticated: Boolean(user && isAuthenticated),
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to load session:", error);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
