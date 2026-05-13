import { Routes, Route } from "react-router-dom";
import { WindowFrame } from "./components/wmp/WindowFrame";
import { Login } from "./pages/Login";
import { AuthCallback } from "./pages/AuthCallback.js";
import "./App.css"

export default function App() {
    return (
      <WindowFrame title="Windows Media Player">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/library"
            element={<div className="text-wmp-blue">Library (coming soon)</div>}
          />
          <Route
            path="/search"
            element={<div className="text-wmp-blue">Search (coming soon)</div>}
          />
          <Route
            path="/now-playing"
            element={
              <div className="text-wmp-blue">Now Playing (coming soon)</div>
            }
          />
        </Routes>
      </WindowFrame>
    );
}