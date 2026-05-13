import { useQuery } from "@tanstack/react-query";
import { spotifyClient } from "../lib/spotify.js";
import type { Playlist } from "../types/spotify.js";

interface PlaylistResponse {
    items: Playlist[]
    next?: string
    total: number
}

export const usePlaylist = (playlistId: string | null) => {
    return useQuery({
        queryKey: ["playlist", playlistId],
        queryFn: async () => {
            if (!playlistId) return null
            const response = await spotifyClient.get<Playlist>(
                `/playlists/${playlistId}`
            );
            return response.data;
        },
        enabled: !!playlistId,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUserPlaylists = (limit = 50, offset = 0) => {
    return useQuery({
        queryKey: ["user-playlists", limit, offset],
        queryFn: async () => {
            const response = await spotifyClient.get<PlaylistResponse>(
                "/me/playlists", 
                { params: { limit, offset } }
            );
            return response.data; 
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};