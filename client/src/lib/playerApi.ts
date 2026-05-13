import { spotifyClient } from "./spotify";

export const transferPlayback = async (deviceId: string, play = true) => {
    await spotifyClient.put("/me/player", { device_ids: [deviceId], play });
};

export const playTrack = async (uris?: string[], context_uri?: string) => {
    await spotifyClient.put("/me/player/play", { uris, context_uri });
}

export const pausePlayback = async () => {
    await spotifyClient.put("/me/player/pause");
}

export const nextTrack = async () => {
    await spotifyClient.post("/me/player/next");
}

export const previousTrack = async () => {
    await spotifyClient.post("/me/player/previous");
}