import { create } from "zustand";
import type { IUser, ITokens } from "@/features/shared/types";

interface AuthStore {
  user: IUser | null;
  tokens: ITokens | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: IUser, tokens: ITokens) => void;
  clearAuth: () => void;
  updateTokens: (tokens: ITokens) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  tokens: null,
  isAuthenticated: false,

  setUser: (user, tokens) => {
    set({
      user,
      tokens,
      isAuthenticated: true,
    });
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_user", JSON.stringify(user));
      localStorage.setItem("auth_tokens", JSON.stringify(tokens));
    }
  },

  clearAuth: () => {
    set({
      user: null,
      tokens: null,
      isAuthenticated: false,
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_tokens");
    }
  },

  updateTokens: (tokens) => {
    set({ tokens });
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_tokens", JSON.stringify(tokens));
    }
  },

  logout: function () {
    this.clearAuth();
  },
}));

// Hydrate store from localStorage on mount
if (typeof window !== "undefined") {
  const storedUser = localStorage.getItem("auth_user");
  const storedTokens = localStorage.getItem("auth_tokens");

  if (storedUser && storedTokens) {
    try {
      useAuthStore.setState({
        user: JSON.parse(storedUser),
        tokens: JSON.parse(storedTokens),
        isAuthenticated: true,
      });
    } catch (e) {
      console.error("Failed to hydrate auth store:", e);
    }
  }
}
