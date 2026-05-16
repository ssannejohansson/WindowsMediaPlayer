import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const spotifyClient = axios.create({
    baseURL: "https://api.spotify.com/BROKEN",
});

// Request interceptor: attach access token
spotifyClient.interceptors.request.use((config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Response interceptor: handle 401 and refresh
spotifyClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 && !error.config._retry) {
            error.config._retry = true;
            const { refreshToken } = useAuthStore.getState();
            try {
                const res = await fetch("http://127.0.0.1:3001/auth/refresh", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refresh_token: refreshToken }),
                });
                if (res.ok) {
                    const data = await res.json();
                    useAuthStore.setState({ accessToken: data.access_token });
                    error.config.headers.Authorization = `Bearer ${data.access_token}`;
                    return spotifyClient(error.config);
                } else {
                    useAuthStore.getState().clearAuth();
                    window.location.href = "/";
                }
            } catch (err) {
                useAuthStore.getState().clearAuth();
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);