import { useState, useEffect } from "react";
import "./taskbar.css";

export const Taskbar = () => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const formatted = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="taskbar">
      {/* Start button */}
      <button type="button" className="taskbar-start">
        <img src="/windows-logo.png" alt="" className="taskbar-start-logo" />
        <span className="taskbar-start-label">Start</span>
      </button>

      {/* Quick launch separator + icons */}
      <div className="taskbar-divider" />
      <div className="taskbar-quicklaunch">
        <button type="button" className="taskbar-ql-btn" title="Internet Explorer">
          <img src="/explorer-icon.png" alt="Internet Explorer" className="taskbar-ql-icon" />
        </button>
        <button type="button" className="taskbar-ql-btn" title="Outlook Express">
          <img src="/outlook-icon.png" alt="Outlook Express" className="taskbar-ql-icon" />
        </button>
        <button type="button" className="taskbar-ql-btn" title="Search">
          <img src="/search-directory-icon.png" alt="Search" className="taskbar-ql-icon" />
        </button>
      </div>
      <div className="taskbar-divider" />

      {/* Active window buttons */}
      <div className="taskbar-buttons">
        <button type="button" className="taskbar-window-btn taskbar-window-btn--active">
          <img src="/wmp-logo2.png" alt="" className="taskbar-window-icon" />
          Windows Media Player
        </button>
      </div>

      {/* System tray */}
      <div className="taskbar-tray">
        <div className="taskbar-divider" />
        <img src="/volume-icon.png" alt="Volume" className="taskbar-tray-icon" />
        <span className="taskbar-clock">{formatted}</span>
      </div>
    </div>
  );
};
