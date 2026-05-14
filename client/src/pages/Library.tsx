import type { ReactElement } from "react";
import { useLibrary } from "../../hooks/useLibrary.js";
import { usePlaylist } from "../../hooks/usePlaylist.js";
import { Spinner } from "../ui/Spinner.js";
import "./library.css";

export const Library = (): ReactElement => {
    // Fetch the users liked songs (saved tracks from Spotify)
    const { data: likedSongs, isLoading: likedLoading } = useLibrary();

    // Fetch user's playlists (created or followed)
    const { data. playlists, isLoading: playlistsLoading } = usePlaylist();

    if (likedLoading || playlistsLoading) {
        return <Spinner />;
    };

    return (
        <div className="library-container">
            <div className="library-section">
                <h2 className="library-heading">Liked Songs</h2>
                {likedSongs && likedSongs.items.length > 0 ? (
                <div className="library-tracks">
                    {likedSongs.items.map((item) => (
                    <div key={item.track.id} className="library-track-row">
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
                    <div key={playlist.id} className="library-playlist-card">
                        {playlist.images?.[0]?.url && (
                        <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="library-playlist-image"
                        />
                        )}
                        <div className="library-playlist-name">{playlist.name}</div>
                        <div className="library-playlist-count">
                        {playlist.tracks.total} tracks
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="library-empty">No playlists yet</div>
                )}
            </div>
            </div>
        );
        };
