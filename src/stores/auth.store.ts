import { create } from "zustand";
import { persist } from "zustand/middleware";
import {User} from "../types/auth";

type AuthStore = {
  user: User | null;
  token: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),
    }),
    {
    name: "auth-storage",
    }
  )
);

