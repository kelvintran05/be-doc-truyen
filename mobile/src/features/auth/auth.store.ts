import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async (user, accessToken, refreshToken) => {
    try {
      await SecureStore.setItemAsync("accessToken", accessToken);
      await SecureStore.setItemAsync("refreshToken", refreshToken);
      // Optional: Save user profile info in secure storage as JSON
      await SecureStore.setItemAsync("userInfo", JSON.stringify(user));
    } catch (e) {
      console.warn("SecureStore set item error:", e);
    }
    set({ user, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
      await SecureStore.deleteItemAsync("userInfo");
    } catch (e) {
      console.warn("SecureStore delete item error:", e);
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      const userInfoStr = await SecureStore.getItemAsync("userInfo");
      
      if (!token || !userInfoStr) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }
      
      const user = JSON.parse(userInfoStr) as User;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
