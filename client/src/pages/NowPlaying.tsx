import { useCallback } from "react";
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.js";
import { usePlayerStore } from "../stores/usePlayerStore.js";
import {
  transferPlayback,
  playTrack,
  pausePlayback,
  nextTrack,
  previousTrack,
} from "../lib/playerApi.js";

export const NowPlaying = () => {
  useSpotifyPlayer();
  const { deviceId, isPlaying, currentTrack, progressMs } = usePlayerStore();

  const handleActivate = useCallback(async () => {
    if (!deviceId) return;
    try {
      await transferPlayback(deviceId, true);
    } catch (err) {
      console.error("transferPlayback failed", err);
    }
  }, [deviceId]);

  const handlePlayPause = useCallback(async () => {
    try {
      if (isPlaying) await pausePlayback();
      else await playTrack();
    } catch (err) {
      console.error("Play/pause failed", err);
    }
  }, [isPlaying]);

  return (
    <div className="p4 text-wmp-blue">
      <div className="mb-2">
        <div className="font-semibold">
          {currentTrack?.name || "No track playing"}
        </div>
        <div className="text-sm">
          {currentTrack?.artists?.map((a) => a.name).join(", ")}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={previousTrack}
          className="px-3 py-1 bg-wmp-gray rounded"
        >
          Prev
        </button>
        <button
          onClick={handlePlayPause}
          className="px-4 py-2 bg-wmp-green text-white rounded"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={nextTrack} className="px-3 py-1 bg-wmp-gray rounded">
          Next
        </button>
        <button
          onClick={handleActivate}
          className="ml-4 px-3 py-1 border rounded"
        >
          Activate Device
        </button>
      </div>

      <div className="mt-3 text-sm text-wmp-textMuted">
        Device: {deviceId || " Not connected"} • Progress: {progressMs ?? 0}ms
      </div>
    </div>
  );
};
