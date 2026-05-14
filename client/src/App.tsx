import { Routes, Route, Navigate } from "react-router-dom";
import { WindowFrame } from "./components/wmp/WindowFrame";
import { RequireAuth } from "./components/routing/RequireAuth.js";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback.js";
import { Search } from "./pages/Search.js";
import "./components/player/player.css"

const Library = () => (
  <div className="p-4 text-wmp-blue"> Library (coming soon)</div>
);

const NowPlaying = () => (
  <div className="p-4 text-wmp-blue">Now Playing (coming soon)</div>
);


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
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <PlayerBar />
        </div>
      </WindowFrame>
    );
}