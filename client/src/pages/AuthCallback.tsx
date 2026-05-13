import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";

export const AuthCallback = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth)

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const expiresIn = params.get("expires_in");
        const spotifyId = params.get("spotify_id");
        const displayName = params.get("display_name");
        
        if (accessToken && spotifyId) {
            setAuth({
                user: { spotifyId, displayName: displayName || undefined },
                accessToken,
                refreshToken: refreshToken || undefined,
                expiresAt: expiresIn ? Date.now() + parseInt(expiresIn) * 1000 : undefined,
            });
            navigate("/library");
        } else {
            navigate("/");
        }
    }, [navigate, setAuth])

    return (
        <div className="flex items-center justify-center h-full">
            <p className="text-wmp-blue">Logging in....</p>
        </div>
    )
    };
