import { useState } from "react";

export const VolumeControl = () => {
  const [volume, setVolume] = useState(70);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
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
        title={`Volume: ${volume}%`}
        aria-label="Volume"
      />
      <span className="volume-label">{volume}%</span>
    </div>
  );
};
