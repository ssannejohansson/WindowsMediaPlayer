import { usePlayerStore } from "../../stores/usePlayerStore.js";

export const ProgressBar = () => {
    const { progressMs, currentTrack } = usePlayerStore();

    // Spotify reports track duration in milliseconds, so keep the raw value here.
    const durationMs = currentTrack?.duration_ms ?? 0;

    // Convert milliseconds to seconds for the visible time labels.
    const elapsed = Math.floor((progressMs ?? 0) / 1000);
    const total = Math.floor(durationMs / 1000);

    const formatTime = (seconds: number) => {
        // Turn 93 seconds into a display string like "1:33".
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="progress-bar-container">
            <div className="progress-bar-time">{formatTime(elapsed)}</div>
            <div className="progress-bar-track">
                {/* Native progress element avoids inline width styles while still showing completion. */}
                <progress
                    className="progress-bar-fill"
                    value={progressMs ?? 0}
                    max={durationMs || 1}
                />
            </div>

            <div className="progress-bar-time">{formatTime(total)}</div>
        </div>
    );
};