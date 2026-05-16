import { useQuery } from "@tanstack/react-query";
import { spotifyClient } from "../lib/spotify.js";
import type { Track } from "../types/spotify.js";

interface RecentlyPlayedItem {
    track: Track;
    played_at: string;
}

interface RecentlyPlayedResponse {
    items: RecentlyPlayedItem[];
}

export const useRecentlyPlayed = (limit = 10) => {
    return useQuery({
        queryKey: ["recently-played", limit],
        queryFn: async () => {
            const res = await spotifyClient.get<RecentlyPlayedResponse>(
                "/me/player/recently-played",
                { params: { limit } },
            );
            return res.data.items;
        },
        staleTime: 1000 * 60,
    });
};
