import { create } from "zustand";

type AuthState = {
    user: { spotifyId: string; displayName?: string; email?: string } | null
    accessToken: string | null
    refreshToken: string | null
    expiresAt: number | null
    setAuth: (payload: {
        user: { spotifyId: string; displayName?: string; email?: string } 
        accessToken: string
        refreshToken?: string
        expiresAt?: number
    }) => void
    clearAuth: () => void
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    setAuth: ({ user, accessToken, refreshToken = null, expiresAt = null }) => 
        set({ user, accessToken, refreshToken, expiresAt}),
    clearAuth: () =>
        set({ user: null, accessToken: null, refreshToken: null, expiresAt: null }),
}));
