import { useState } from "react";

export const VolumeControl = () => {
  const [volume, setVolume] = useState(70);

  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
    // TODO: Connect to Spotify Web Playback SDK volume API in Phase 4
  };

  return (
    <div className="volume-control">
      <span className="volume-icon">🔊</span>
      <input
        type="range"
        min="0"
        max="100"
        value={volume}
        onChange={handleVolumeChange}
        className="volume-slider"
      />
      <span className="volume-label">{volume}%</span>
    </div>
  );
};
