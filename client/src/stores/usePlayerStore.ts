import { create } from "zustand";
type CurrentTrack = {
  id: string;
  name: string;
  duration_ms: number;
  artists: Array<{ id: string; name: string }>;
  album: { id: string; name: string };
};

type PlayerState = {
  deviceId: string | null;
  isPlaying: boolean;
  currentTrack: CurrentTrack | null;
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
