import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvStorage } from "@/shared/utils/mmkvStorage";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
} from "@/shared/utils/secureStore";
import { signOutFromGoogle } from "../utils/google";
import { deleteFCMToken } from "../utils/fcm";

export type AuthRole = "Admin" | "User";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  isAdmin: boolean;
  isEmailVerified: boolean;
};

type AuthState = {
  user: AuthUser | null;
  role: AuthRole | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  login: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,
      isAdmin: false,
      isAuthenticated: false,
      isHydrated: false,

      setUser: (user) => {
        set({
          user,
          role: user?.role ?? null,
          isAdmin: user?.isAdmin ?? false,
          isAuthenticated: Boolean(user),
        });
      },

      setTokens: async (accessToken, refreshToken) => {
        await Promise.all([
          setAccessToken(accessToken),
          setRefreshToken(refreshToken),
        ]);
      },

      login: async ({ user, accessToken, refreshToken }) => {
        await Promise.all([
          setAccessToken(accessToken),
          setRefreshToken(refreshToken),
        ]);

        set({
          user,
          role: user.role,
          isAdmin: user.isAdmin,
          isAuthenticated: true,
        });
      },

      logout: async () => {
        set({
          user: null,
          role: null,
          isAdmin: false,
          isAuthenticated: false,
        });
        await deleteFCMToken();
        await clearTokens();
        await signOutFromGoogle();
      },

      hydrate: async () => {
        const [accessToken, refreshToken] = await Promise.all([
          getAccessToken(),
          getRefreshToken(),
        ]);

        const hasTokens = Boolean(accessToken && refreshToken);

        if (!hasTokens) {
          await clearTokens();
          set({
            user: null,
            role: null,
            isAdmin: false,
            isAuthenticated: false,
            isHydrated: true,
          });
          return;
        }

        set({ isAuthenticated: true, isHydrated: true });
      },
    }),
    {
      name: "auth-store",
      storage: mmkvStorage,
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAdmin: state.isAdmin,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
