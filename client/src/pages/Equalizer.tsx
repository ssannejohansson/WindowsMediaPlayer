import type { ReactElement } from "react";
import { useState } from "react";
import "./equalizer.css";

type EQPreset = "flat" | "bass" | "treble" | "vocal" | "custom";

export const Equalizer = (): ReactElement => {
  // 10-band equalizer frequencies: 60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 6kHz, 10kHz, 16kHz, 20kHz, etc.
  const bands = [60, 150, 400, 1000, 2400, 6000, 10000, 16000, 20000, 32000];

  // Store each band's gain value (-12dB to +12dB).
  const [gains, setGains] = useState<number[]>(Array(10).fill(0));

  // Track which preset is active for UI feedback.
  const [activePreset, setActivePreset] = useState<EQPreset>("flat");

  const applyPreset = (preset: EQPreset) => {
    let newGains = Array(10).fill(0);

    if (preset === "bass") {
      // Boost low frequencies.
      newGains = [8, 6, 4, 2, 0, 0, -2, -4, -6, -8];
    } else if (preset === "treble") {
      // Boost high frequencies.
      newGains = [-8, -6, -4, -2, 0, 0, 2, 4, 6, 8];
    } else if (preset === "vocal") {
      // Emphasize midrange for vocals.
      newGains = [-4, 0, 4, 6, 4, 2, 0, -2, -4, -6];
    }
    // "flat" and "custom" keep current or reset to 0

    setGains(newGains);
    setActivePreset(preset);
  };

  const handleBandChange = (index: number, value: number) => {
    const newGains = [...gains];
    newGains[index] = value;
    setGains(newGains);
    setActivePreset("custom");
  };

  const handleReset = () => {
    setGains(Array(10).fill(0));
    setActivePreset("flat");
  };

  return (
    <div className="equalizer-container">
      <div className="equalizer-header">
        <div className="equalizer-title">10-Band Equalizer</div>
        <div className="equalizer-subtitle">
          Local audio tuning (preview only)
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="equalizer-presets">
        <button
          className={`equalizer-preset-btn ${
            activePreset === "flat" ? "active" : ""
          }`}
          onClick={() => applyPreset("flat")}
        >
          Flat
        </button>
        <button
          className={`equalizer-preset-btn ${
            activePreset === "bass" ? "active" : ""
          }`}
          onClick={() => applyPreset("bass")}
        >
          Bass
        </button>
        <button
          className={`equalizer-preset-btn ${
            activePreset === "treble" ? "active" : ""
          }`}
          onClick={() => applyPreset("treble")}
        >
          Treble
        </button>
        <button
          className={`equalizer-preset-btn ${
            activePreset === "vocal" ? "active" : ""
          }`}
          onClick={() => applyPreset("vocal")}
        >
          Vocal
        </button>
      </div>

      {/* Equalizer Bands */}
      <div className="equalizer-bands">
        {bands.map((frequency, idx) => (
          <div key={idx} className="equalizer-band">
            <div className="equalizer-band-label">
              {frequency < 1000
                ? frequency
                : `${(frequency / 1000).toFixed(1)}k`}
              Hz
            </div>

            {/* Vertical slider */}
            <input
              type="range"
              min="-12"
              max="12"
              value={gains[idx]}
              onChange={(e) =>
                handleBandChange(idx, Number(e.currentTarget.value))
              }
              className="equalizer-slider"
            />

            {/* Gain value display */}
            <div className="equalizer-band-value">
              {gains[idx] > 0 ? "+" : ""}
              {gains[idx]} dB
            </div>
          </div>
        ))}
      </div>

      {/* Reset Button */}
      <div className="equalizer-footer">
        <button onClick={handleReset} className="equalizer-reset-btn">
          Reset to Flat
        </button>
        <div className="equalizer-info">
          Currently:{" "}
          <span className="equalizer-preset-name">{activePreset}</span>
        </div>
      </div>
    </div>
  );
};
