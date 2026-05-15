import type { ReactElement } from "react";
import { useState } from "react";
import { usePlayerStore } from "../../stores/usePlayerStore.js";
import { useSpotifyPlayer } from "../../hooks/useSpotifyPlayer.js";
import {
  transferPlayback,
  pausePlayback,
  nextTrack,
  previousTrack,
} from "../../lib/playerApi.js";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const PlayerBar = (): ReactElement => {
  const { isPlaying, currentTrack, deviceId, progressMs } = usePlayerStore();
  const [volume, setVolume] = useState(70);

  // Keep the Spotify player connected and update store state from SDK events.
  useSpotifyPlayer();

  const handlePlay = async () => {
    // Resume playback on the active device. The SDK/device handshake happens in useSpotifyPlayer.
    if (deviceId) await transferPlayback(deviceId, true);
  };

  const handlePause = async () => {
    if (deviceId) await pausePlayback();
  };

  const handleNext = async () => {
    if (deviceId) await nextTrack();
  };

  const handlePrev = async () => {
    if (deviceId) await previousTrack();
  };

  const durationMs = currentTrack?.duration_ms ?? 0;
  const elapsed = formatTime(Math.floor((progressMs ?? 0) / 1000));
  const total = formatTime(Math.floor(durationMs / 1000));

  return (
    <div className="player-bar">
      {/* Play / Pause */}
      <button
        type="button"
        className="player-control-btn player-control-btn-play"
        onClick={isPlaying ? handlePause : handlePlay}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? '▐▐' : '▶'}
      </button>

      {/* Stop */}
      <button type="button" className="player-control-btn player-control-btn-stop" title="Stop">{'■'}</button>

      {/* Previous */}
      <button type="button" className="player-control-btn" onClick={handlePrev} title="Previous">{'◀◀'}</button>

      {/* Next */}
      <button type="button" className="player-control-btn" onClick={handleNext} title="Next">{'▶▶'}</button>

      {/* Volume icon + dropdown button */}
      <button type="button" className="player-vol-btn" title="Volume">
        {'♪'}<span className="player-vol-arrow">{'▾'}</span>
      </button>

      {/* Volume slider */}
      <input
        type="range"
        className="player-vol-slider"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        title={`Volume: ${volume}%`}
      />

      {/* Vertical separator */}
      <div className="player-bar-sep" />

      {/* Seek slider */}
      <input
        type="range"
        className="player-seek-slider"
        min={0}
        max={durationMs || 1}
        value={progressMs ?? 0}
        onChange={() => {/* seeking not implemented yet */}}
        title="Seek"
      />

      {/* Time display */}
      <span className="player-bar-time">{elapsed} / {total}</span>
    </div>
  );
};
