import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (token, user) => {
    if (!token || typeof token !== "string") {
      throw new Error("login: missing or invalid token");
    }

    await AsyncStorage.setItem("token", token);
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, user: null });
    
    // Dynamically import to avoid circular dependency issues at the store level
    const { socketService } = await import("@/src/services/socket");
    socketService.disconnect();
  },
}));
