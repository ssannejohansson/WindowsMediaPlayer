import { useState } from "react";
import { useSearch } from "../hooks/useSearch.js";

export const Search = () => {
    const [query, setQuery] = useState("");
    const [searchType, setSearchType] = useState<"track" | "artist" | "album" | "playlist">("track");
    const { data, isLoading, error } = useSearch(query, searchType);

    return (
        <div className="p-4 text-wmp-blue">
            <input
            type="text"
            placeholder="Search tracks, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 bg-wmp-gray border border-wmp-blue rounded mb-4"
            />

            <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as typeof searchType)}
            className="px-3 py-2 bg-wmp-gray border border-wmp-blue rounded mb-4">
                <option value="track">Tracks</option>
                <option value="artist">Artists</option>
                <option value="album">Albums</option>
                <option value="playlist">Playlists</option>
            </select>

            {isLoading && <p>Loading....</p>}
            {error && <p className="text-red-500">Error: {(error as Error).message}</p>}

            {data?.tracks?.items && (
                <div>
                    <h2 className="font-bold mb-2">Tracks</h2>
                    {data.tracks.items.map((track) => (
                        <div key={track.id} className="mb-2 p-2 bg-wmp-gray border border-wmp-blue rounded">
                            <p className="font-semibold">{track.name}</p>
                            <p className="text-sm">{track.artists.map((a) => a.name).join(", ")}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}