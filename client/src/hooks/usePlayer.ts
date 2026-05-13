import { useQuery } from "@tanstack/react-query";
import { spotifyClient } from "../lib/spotify.js";

interface PlaybackState {
    device: { id: string; name: string; type: string }
    is_playing: boolean
    item: { id: string; name: string; duration_ms: number } | null
    progress_ms: number
    currently_playing_type: "track" | "episode" | "ad" | "unknown"
}

export const usePlayer = () => {
    return useQuery({
        queryKey: ["player", "current"],
        queryFn: async () => {
            const response = await spotifyClient.get<PlaybackState>(
                "/me/player/currently-playing"
            );
            return response.data;
        },
        staleTime: 1000, // 1 second
        refetchInterval: 1000, // 1 second
    });
};