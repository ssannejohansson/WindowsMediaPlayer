import { useQuery } from "@tanstack/react-query";
import { spotifyClient } from "../lib/spotify.js";
import type { SearchResponse } from "../types/spotify.js";

export const useSearch = (query: string, type: "track" | "artist" | "album" | "playlist" = "track") => {
    return useQuery({
        queryKey: ["search", query, type],
        queryFn: async () => {
            if (!query) return null
            const response = await spotifyClient.get<SearchResponse>("/search", {
                params: { q: query, type, limit: 20},
            });
            return response.data
        },
        enabled: !!query,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
