import { create } from "zustand";
import type { Track } from "../types/spotify.js";

type PlayerState = {
  deviceId: string | null;
  isPlaying: boolean;
  currentTrack: Track | null;
  progressMs: number | null;
  setPlaybackState: (
    payload: Partial<Omit<PlayerState, "setPlaybackState">>,
  ) => void;
  clearPlayback: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  deviceId: null,
  isPlaying: false,
  currentTrack: null,
  progressMs: null,
  setPlaybackState: (payload) => set((state) => ({ ...state, ...payload })),
  clearPlayback: () =>
    set({
      deviceId: null,
      isPlaying: false,
      currentTrack: null,
      progressMs: null,
    }),
}));
