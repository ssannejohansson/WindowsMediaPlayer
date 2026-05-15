import type { ReactElement } from "react";
import { usePlayerStore } from "../stores/usePlayerStore.js";
import {
  transferPlayback,
  pausePlayback,
  nextTrack,
  previousTrack,
} from "../lib/playerApi.js";
import { ProgressBar } from "../components/player/ProgressBar.js";
import "./nowplaying.css";

export const NowPlaying = (): ReactElement => {
  const { isPlaying, currentTrack, deviceId } = usePlayerStore();

  const handlePlay = async () => {
    if (deviceId) {
      await transferPlayback(deviceId, true);
    }
  };

  const handlePause = async () => {
    if (deviceId) {
      await pausePlayback();
    }
  };

  const handleNext = async () => {
    if (deviceId) {
      await nextTrack();
    }
  };

  const handlePrev = async () => {
    if (deviceId) {
      await previousTrack();
    }
  };

  return (
    <div className="nowplaying-container">
      {currentTrack ? (
        <>
          {/* Large album art display */}
          <div className="nowplaying-album-section">
            {currentTrack.album?.images?.[0]?.url && (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album?.name}
                className="nowplaying-album-art"
              />
            )}
          </div>

          {/* Track and artist info */}
          <div className="nowplaying-info-section">
            <div className="nowplaying-track-name">{currentTrack.name}</div>
            <div className="nowplaying-artist-name">
              {currentTrack.artists
                .map((a: { name: string }) => a.name)
                .join(", ")}
            </div>
            <div className="nowplaying-album-name">
              {currentTrack.album?.name}
            </div>
          </div>

          {/* Progress bar with elapsed and total time */}
          <div className="nowplaying-progress-section">
            <ProgressBar />
          </div>

          {/* Playback controls */}
          <div className="nowplaying-controls">
            <button
              className="nowplaying-control-btn"
              onClick={handlePrev}
              title="Previous track"
            >
              ⏮ PREV
            </button>

            <button
              className="nowplaying-control-btn nowplaying-control-btn-play"
              onClick={isPlaying ? handlePause : handlePlay}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? "⏸ PAUSE" : "▶ PLAY"}
            </button>

            <button
              className="nowplaying-control-btn"
              onClick={handleNext}
              title="Next track"
            >
              NEXT ⏭
            </button>
          </div>

          {/* Device status indicator */}
          <div className="nowplaying-device-status">
            {deviceId ? (
              <span className="nowplaying-status-connected">
                ● Connected to device
              </span>
            ) : (
              <span className="nowplaying-status-waiting">
                ◯ Waiting for device...
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="nowplaying-empty">
          <div className="nowplaying-empty-message">No track playing</div>
          <div className="nowplaying-empty-hint">
            Play a track from your library or search to get started
          </div>
        </div>
      )}
    </div>
  );
};
