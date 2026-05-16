import type { ReactElement } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlaylist } from "../hooks/usePlaylist.js";
import { useLikedStatus, useLikeToggle } from "../hooks/useLikedSongs.js";
import { Spinner } from "../components/ui/Spinner.js";
import { playTrack } from "../lib/playerApi.js";
import { usePlayerStore } from "../stores/usePlayerStore.js";
import "./playlist.css";

const formatDuration = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, "0")}`;
};

export const Playlist = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const deviceId = usePlayerStore((s) => s.deviceId);

  // Fetch the specific playlist by ID.
  const { data: playlist, isLoading } = usePlaylist(id);

  const trackIds = playlist?.items?.items?.map((i) => i.item?.id).filter(Boolean) as string[] ?? [];
  const { data: likedStatus } = useLikedStatus(trackIds);
  const { mutate: toggleLike } = useLikeToggle();

  if (isLoading) {
    return <Spinner />;
  }

  const trackCount = playlist?.items?.total ?? 0;

  if (!playlist) {
    return (
      <div className="playlist-container">
        <div className="playlist-error">
          <div className="playlist-error-message">Playlist not found</div>
          <button
            onClick={() => navigate("/library")}
            className="playlist-error-btn"
          >
            ← Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        {playlist.images?.[0]?.url && (
          <img
            src={playlist.images[0].url}
            alt={playlist.name}
            className="playlist-header-image"
          />
        )}

        <div className="playlist-header-info">
          <div className="playlist-type">PLAYLIST</div>
          <div className="playlist-title">{playlist.name}</div>
          <div className="playlist-meta">
            {trackCount} tracks
            {playlist.owner && ` • By ${playlist.owner.display_name}`}
          </div>
        </div>
      </div>

      <div className="playlist-content">
        {trackCount > 0 ? (
          <div className="playlist-tracks">
            <div className="playlist-tracks-header">
              <div className="playlist-tracks-number">#</div>
              <div className="playlist-tracks-name">Title</div>
              <div className="playlist-tracks-artist">Artist</div>
              <div></div>
              <div className="playlist-tracks-duration">Duration</div>
            </div>

            {playlist.items?.items?.filter((item) => item.item).map((item, idx) => {
              const track = item.item!;
              const isLiked = likedStatus?.[track.id] ?? false;
              return (
                <div
                  key={track.id}
                  className="playlist-track-row"
                  onClick={() => playTrack(undefined, playlist.uri, deviceId, { uri: track.uri })}
                >
                  <div className="playlist-tracks-number">{idx + 1}</div>
                  <div className="playlist-tracks-name">{track.name}</div>
                  <div className="playlist-tracks-artist">
                    {track.artists.map((a) => a.name).join(", ")}
                  </div>
                  <button
                    type="button"
                    className={`heart-btn${isLiked ? " liked" : ""}`}
                    title={isLiked ? "Remove from liked songs" : "Add to liked songs"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike({ id: track.id, currentlyLiked: isLiked });
                    }}
                  >{isLiked ? '♥' : '♡'}</button>
                  <div className="playlist-tracks-duration">
                    {formatDuration(track.duration_ms)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="playlist-empty">This playlist is empty</div>
        )}
      </div>

      <button
        onClick={() => navigate("/library")}
        className="playlist-back-btn"
      >
        ← Back to Library
      </button>
    </div>
  );
};
