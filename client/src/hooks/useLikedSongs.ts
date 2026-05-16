import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { spotifyClient } from "../lib/spotify.js";

// Returns a map of trackId → isLiked for the given IDs.
export const useLikedStatus = (trackIds: string[]) => {
    return useQuery({
        queryKey: ["liked-status", [...trackIds].sort().join(",")],
        queryFn: async (): Promise<Record<string, boolean>> => {
            const res = await spotifyClient.get<boolean[]>("/me/tracks/contains", {
                params: { ids: trackIds.join(",") },
            });
            return Object.fromEntries(trackIds.map((id, i) => [id, res.data[i]]));
        },
        enabled: trackIds.length > 0,
        staleTime: 1000 * 60,
    });
};

export const useLikeToggle = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, currentlyLiked }: { id: string; currentlyLiked: boolean }) => {
            if (currentlyLiked) {
                await spotifyClient.delete("/me/tracks", { data: { ids: [id] } });
            } else {
                await spotifyClient.put("/me/tracks", { ids: [id] });
            }
        },
        onMutate: async ({ id, currentlyLiked }) => {
            // Freeze in-flight liked-status fetches so they don't overwrite the optimistic value.
            await queryClient.cancelQueries({ queryKey: ["liked-status"] });

            // Snapshot every liked-status cache entry so we can roll back on error.
            const snapshot = queryClient.getQueriesData<Record<string, boolean>>({
                queryKey: ["liked-status"],
            });

            // Flip the liked state for this track in every cached liked-status entry.
            queryClient.setQueriesData<Record<string, boolean>>(
                { queryKey: ["liked-status"] },
                (old) => (old && id in old ? { ...old, [id]: !currentlyLiked } : old),
            );

            return { snapshot };
        },
        onError: (_err, _vars, context) => {
            // Roll back all liked-status entries to what they were before the mutation.
            context?.snapshot.forEach(([key, data]) => queryClient.setQueryData(key, data));
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["liked-status"] });
            queryClient.invalidateQueries({ queryKey: ["library"] });
        },
    });
};
