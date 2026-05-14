import type { ReactElement } from "react";
import { usePlayerStore } from "../../stores/usePlayerStore.js";
import { useSpotifyPlayer } from "../../hooks/useSpotifyPlayer.js";
import {
  transferPlayback,
  pausePlayback,
  nextTrack,
  previousTrack,
} from "../../lib/playerApi.js";
import { ProgressBar } from "./ProgressBar.js";
import { VolumeControl } from "./VolumeControl.js";

export const PlayerBar = (): ReactElement => {
  const { isPlaying, currentTrack, deviceId } = usePlayerStore();

  // Keep the Spotify player connected and update store state from SDK events.
  useSpotifyPlayer();

  const handlePlay = async () => {
    // Resume playback on the active device. The SDK/device handshake happens in useSpotifyPlayer.
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
    <div className="player-bar">
      <div className="player-bar-track-info">
        {currentTrack ? (
          <>
            {/* The store only keeps the text metadata for now, so this is a compact text-only block. */}
            <div className="player-bar-track-text">
              <div className="player-bar-track-name">{currentTrack.name}</div>
              <div className="player-bar-artist-name">
                {currentTrack.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          </>
        ) : (
          <div className="player-bar-track-text">
            <div className="player-bar-track-name">No track playing</div>
            <div className="player-bar-artist-name">
              {deviceId ? "Ready" : "Waiting for device..."}
            </div>
          </div>
        )}
      </div>

      <div className="player-bar-controls">
        <button
          className="player-control-btn"
          onClick={handlePrev}
          title="Previous"
        >
          ⏮
        </button>

        <button
          className="player-control-btn player-control-btn-play"
          onClick={isPlaying ? handlePause : handlePlay}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          className="player-control-btn"
          onClick={handleNext}
          title="Next"
        >
          ⏭
        </button>
      </div>

      <div className="player-bar-right">
        <ProgressBar />
        <VolumeControl />
      </div>
    </div>
  );
};
