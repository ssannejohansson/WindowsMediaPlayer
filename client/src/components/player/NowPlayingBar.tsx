import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../../stores/usePlayerStore.js";
import "./nowplayingbar.css";

export const NowPlayingBar = () => {
    const navigate = useNavigate();
    const { currentTrack, isPlaying } = usePlayerStore();

    if (!currentTrack) return null;

    const albumArt = currentTrack.album?.images?.[2]?.url ?? currentTrack.album?.images?.[0]?.url;

    return (
        <div className="now-playing-bar" onClick={() => navigate("/now-playing")}>
            {albumArt && (
                <img className="now-playing-bar-art" src={albumArt} alt={currentTrack.album?.name} />
            )}
            <div className="now-playing-bar-text">
                <span className="now-playing-bar-track">{currentTrack.name}</span>
                <span className="now-playing-bar-artist">
                    {currentTrack.artists.map((a) => a.name).join(", ")}
                </span>
            </div>
            <div className={`now-playing-bar-indicator${isPlaying ? " playing" : ""}`}>
                <span />
                <span />
                <span />
            </div>
        </div>
    );
};
