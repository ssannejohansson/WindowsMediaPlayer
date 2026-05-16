import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
  const albumArt = currentTrack?.album?.images?.[2]?.url ?? currentTrack?.album?.images?.[0]?.url;

  return (
    <div className="player-bar">
      {/* Mobile only: art + track name — whole area taps to NowPlaying */}
      {currentTrack && (
        <button type="button" className="player-mobile-info" onClick={() => navigate("/now-playing")}>
          {albumArt && <img className="player-mobile-art" src={albumArt} alt={currentTrack.album?.name} />}
          <span className="player-mobile-track">{currentTrack.name}</span>
        </button>
      )}

      {/* Play / Pause — visible on both desktop and mobile */}
      <button
        type="button"
        className="player-control-btn player-control-btn-play"
        onClick={isPlaying ? handlePause : handlePlay}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? '▐▐' : '▶'}
      </button>

      {/* Stop */}
      <button type="button" className="player-control-btn player-control-btn-stop player-desktop-only" title="Stop">{'■'}</button>

      {/* Previous */}
      <button type="button" className="player-control-btn player-desktop-only" onClick={handlePrev} title="Previous">{'◀◀'}</button>

      {/* Next */}
      <button type="button" className="player-control-btn player-desktop-only" onClick={handleNext} title="Next">{'▶▶'}</button>

      {/* Volume icon + dropdown button */}
      <button type="button" className="player-vol-btn player-desktop-only" title="Volume">
        {'♪'}<span className="player-vol-arrow">{'▾'}</span>
      </button>

      {/* Volume slider */}
      <input
        type="range"
        className="player-vol-slider player-desktop-only"
        min={0}
        max={100}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        title={`Volume: ${volume}%`}
      />

      {/* Vertical separator */}
      <div className="player-bar-sep player-desktop-only" />

      {/* Seek slider */}
      <input
        type="range"
        className="player-seek-slider player-desktop-only"
        min={0}
        max={durationMs || 1}
        value={progressMs ?? 0}
        onChange={() => {/* seeking not implemented yet */}}
        title="Seek"
      />

      {/* Time display */}
      <span className="player-bar-time player-desktop-only">{elapsed} / {total}</span>
    </div>
  );
};
