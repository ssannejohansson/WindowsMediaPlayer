import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore.js";
import "./nowplaying.css";

export const NowPlaying = (): ReactElement => {
  const { currentTrack } = usePlayerStore();
  const navigate = useNavigate();

  return (
    <div className="nowplaying-container">
      <button type="button" className="nowplaying-back-btn" onClick={() => navigate("/library")}>
        ◀ Back to Library
      </button>

      {currentTrack ? (
        <div className="nowplaying-center">
          {/* Large album art */}
          <div className="nowplaying-album-section">
            {currentTrack.album?.images?.[0]?.url && (
              <img
                src={currentTrack.album.images[0].url}
                alt={currentTrack.album?.name}
                className="nowplaying-album-art"
              />
            )}
          </div>

          {/* Track info */}
          <div className="nowplaying-info-section">
            <div className="nowplaying-track-name">{currentTrack.name}</div>
            <div className="nowplaying-artist-name">
              {currentTrack.artists.map((a: { name: string }) => a.name).join(", ")}
            </div>
            <div className="nowplaying-album-name">{currentTrack.album?.name}</div>
          </div>
        </div>
      ) : (
        <div className="nowplaying-empty">
          <div className="nowplaying-empty-message">No track playing</div>
          <div className="nowplaying-empty-hint">
            Play a track from your library to get started
          </div>
        </div>
      )}
    </div>
  );
};
