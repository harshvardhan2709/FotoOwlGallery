import { create } from "zustand";
import { storage } from "@/services/storage";
import { useGalleryStore } from "@/store/galleryStore";
import { AuthState, User } from "@/types/auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  register: async (user: User) => {
    await storage.setUser(user);
    await storage.setFavorites([], user.email);
    useGalleryStore.setState({ favorites: [] });

    set({
      user,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  login: async (email: string, password: string) => {
    const storedUser = await storage.getUser(email);

    if (!storedUser) {
      return false;
    }

    const credentialsValid =
      storedUser.email.toLowerCase() === email.toLowerCase() &&
      storedUser.password === password;

    if (!credentialsValid) {
      return false;
    }

    await storage.setUser(storedUser);
    await storage.setSession(true);

    set({
      user: storedUser,
      isAuthenticated: true,
      isLoading: false,
    });

    await useGalleryStore.getState().loadFavorites();

    return true;
  },

  logout: async () => {
    await storage.clearSession();
    useGalleryStore.setState({ favorites: [] });

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

      const isAuth = Boolean(user && isAuthenticated);

      set({
        user,
        isAuthenticated: isAuth,
        isLoading: false,
      });

      if (isAuth && user) {
        await useGalleryStore.getState().loadFavorites();
      } else {
        useGalleryStore.setState({ favorites: [] });
      }
    } catch (error) {
      console.error("Failed to load session:", error);

      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      useGalleryStore.setState({ favorites: [] });
    }
  },

  updateProfile: async (updatedData: Partial<User>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    const newUser: User = {
      ...currentUser,
      ...updatedData,
    };

    await storage.setUser(newUser);

    set({
      user: newUser,
    });
  },
}));
