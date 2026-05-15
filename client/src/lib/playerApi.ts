import { spotifyClient } from "./spotify";

export const transferPlayback = async (deviceId: string, play = true) => {
    await spotifyClient.put("/me/player", { device_ids: [deviceId], play });
};

export const playTrack = async (
    uris?: string[],
    context_uri?: string,
    deviceId?: string | null,
    offset?: { uri: string } | { position: number },
) => {
    await spotifyClient.put(
        "/me/player/play",
        { uris, context_uri, offset },
        { params: deviceId ? { device_id: deviceId } : undefined },
    );
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