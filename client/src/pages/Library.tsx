import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { useLibrary } from "../hooks/useLibrary.js";
import { useUserPlaylists } from "../hooks/usePlaylist.js";
import { useRecentlyPlayed } from "../hooks/useRecentlyPlayed.js";
import { LibrarySkeleton } from "../components/ui/LibrarySkeleton.js";
import { playTrack } from "../lib/playerApi.js";
import { usePlayerStore } from "../stores/usePlayerStore.js";
import "./library.css";

const formatDuration = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    return `${min}:${sec.toString().padStart(2, "0")}`;
};

export const Library = (): ReactElement => {
    const deviceId = usePlayerStore((s) => s.deviceId);

    // Fetch the users liked songs (saved tracks from Spotify)
    const { data: likedSongs, isLoading: likedLoading } = useLibrary();

    // Fetch user's playlists (created or followed)
    const { data: playlists, isLoading: playlistsLoading } = useUserPlaylists();

    const { data: recentlyPlayed } = useRecentlyPlayed();

    if (likedLoading || playlistsLoading) {
        return <LibrarySkeleton />;
    };

    return (
        <div className="library-container">
            {recentlyPlayed && recentlyPlayed.length > 0 && (
                <div className="library-section">
                    <h2 className="library-heading">Recently Played</h2>
                    <div className="library-recent-strip">
                        {recentlyPlayed.map((item) => (
                            <button
                                type="button"
                                key={item.played_at}
                                className="library-recent-item"
                                onClick={() => playTrack([item.track.uri], undefined, deviceId)}
                                title={`${item.track.name} — ${item.track.artists.map((a) => a.name).join(", ")}`}
                            >
                                {item.track.album?.images?.[0]?.url && (
                                    <img
                                        src={item.track.album.images[0].url}
                                        alt={item.track.album.name}
                                        className="library-recent-art"
                                    />
                                )}
                                <div className="library-recent-name">{item.track.name}</div>
                                <div className="library-recent-artist">
                                    {item.track.artists.map((a) => a.name).join(", ")}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="library-section">
                <h2 className="library-heading">Liked Songs</h2>
                {likedSongs && likedSongs.items.length > 0 ? (
                <div className="library-tracks">
                    {likedSongs.items.map((item, idx) => (
                    <div key={item.track.id} className="library-track-row" onClick={() => playTrack(likedSongs.items.map((i) => i.track.uri), undefined, deviceId, { position: idx })}>
                        <div className="library-track-art">
                        {item.track.album?.images?.[0]?.url && (
                            <img
                            src={item.track.album.images[0].url}
                            alt={item.track.album.name}
                            />
                        )}
                        </div>
                        <div className="library-track-info">
                        <div className="library-track-name">{item.track.name}</div>
                        <div className="library-track-artist">
                            {item.track.artists.map((a) => a.name).join(", ")}
                        </div>
                        </div>
                        <div className="library-track-album">
                        {item.track.album?.name}
                        </div>
                        <div className="library-track-duration">
                        {formatDuration(item.track.duration_ms)}
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="library-empty">No liked songs yet</div>
                )}
            </div>

            <div className="library-section">
                <h2 className="library-heading">Your Playlists</h2>
                {playlists && playlists.items.length > 0 ? (
                <div className="library-playlists">
                    {playlists.items.map((playlist) => (
                    <Link key={playlist.id} to={`/playlist/${playlist.id}`} className="library-playlist-card">
                        {playlist.images?.[0]?.url && (
                        <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="library-playlist-image"
                        />
                        )}
                        <div className="library-playlist-name">{playlist.name}</div>
                        <div className="library-playlist-count">
                        {playlist.items?.total ?? 0} tracks
                        </div>
                    </Link>
                    ))}
                </div>
                ) : (
                <div className="library-empty">No playlists yet</div>
                )}
            </div>
            </div>
        );
        };
