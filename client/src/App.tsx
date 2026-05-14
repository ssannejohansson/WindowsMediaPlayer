import { Routes, Route, Navigate } from "react-router-dom";
import { WindowFrame } from "./components/wmp/WindowFrame";
import { PlayerBar } from "./components/player/PlayerBar.js";
import { RequireAuth } from "./components/routing/RequireAuth.js";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback.js";
import { Search } from "./pages/Search.js";
import { Library } from "./pages/Library.js";
import { NowPlaying } from "./pages/NowPlaying.js";
import { Playlist } from "./pages/Playlist.js";
import { Equalizer } from "./pages/Equalizer.js";
import "./components/player/player.css";

export default function App() {
  return (
    <WindowFrame title="Windows Media Player">
      <div className="app-layout">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route element={<RequireAuth />}>
            <Route path="/library" element={<Library />} />
            <Route path="/search" element={<Search />} />
            <Route path="/now-playing" element={<NowPlaying />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/equalizer" element={<Equalizer />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <PlayerBar />
      </div>
    </WindowFrame>
  );
}
