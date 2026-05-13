import { useQuery } from "@tanstack/react-query";
import { spotifyClient } from "../lib/spotify.js";
import type { Track } from "../types/spotify.js";

interface LibraryResponse {
    items: Array<{ track: Track }>
    next?: string
    total: number
}

export const useLibrary = (limit = 50, offset = 0) => {
    return useQuery({
        queryKey: ["library", limit, offset],
        queryFn: async () => {
            const response = await spotifyClient.get<LibraryResponse>(
                "/me/tracks", 
                { params: { limit, offset } }
            );
            return response.data
        },
        staleTime: 5 * 60 * 1000, // 5 minutes 
    });
};
