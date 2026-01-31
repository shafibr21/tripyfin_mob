import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    await AsyncStorage.setItem("token", token);
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, user: null });
  },
}));
