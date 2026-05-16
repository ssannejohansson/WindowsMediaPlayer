import { useAuthStore } from "../stores/useAuthStore.js";

interface SpotifyPlayerOptions {
    name: string;
    getOAuthToken: (cb: (token: string) => void) => void;
}

interface SpotifyPlayerEvent {
    message: string;
}

interface SpotifyReadyEvent {
    device_id: string;
}

interface SpotifyPlayer {
    addListener(event: "initialization_error" | "authentication_error" | "account_error" | "playback_error", cb: (e: SpotifyPlayerEvent) => void): void;
    addListener(event: "ready" | "not_ready", cb: (e: SpotifyReadyEvent) => void): void;
    connect(): Promise<boolean>;
    disconnect(): void;
}

interface SpotifyGlobal {
    Player: new (options: SpotifyPlayerOptions) => SpotifyPlayer;
}

declare global {
    interface Window {
        Spotify?: SpotifyGlobal;
        onSpotifyWebPlaybackSDKReady?: () => void;
    }
}

// Load the Spotify Web Playback SDK script
export const loadSpotifySDK = (): Promise<void> =>
  new Promise((resolve) => {
    if (window.Spotify) return resolve();
    window.onSpotifyWebPlaybackSDKReady = resolve;
    const s = document.createElement("script");
    s.src = "https://sdk.scdn.co/spotify-player.js";
    s.async = true;
    document.body.appendChild(s);
  });

// Initialize a Spotify Player instance. Returns the player and its device ID once ready.
export const initSpotifyPlayer = async (name = "WMP Player"): Promise<{ player: SpotifyPlayer; deviceId: string }> => {
  await loadSpotifySDK();
  const token = useAuthStore.getState().accessToken;
  if (!token) throw new Error("No access token available for Spotify Player");

  return new Promise<{ player: SpotifyPlayer; deviceId: string }>((resolve, reject) => {
    const PlayerCtor = window.Spotify?.Player;
    if (!PlayerCtor)
      return reject(new Error("Spotify Player constructor not found"));

    const player = new PlayerCtor({
      name,
      getOAuthToken: (cb) => cb(token),
    });

    player.addListener("initialization_error", ({ message }) => {
      console.error("Spotify Player init error", message);
      reject(new Error(message));
    });
    player.addListener("authentication_error", ({ message }) => {
      console.error("Spotify Player auth error", message);
      reject(new Error(message));
    });
    player.addListener("account_error", ({ message }) => {
      console.error("Spotify Player account error", message);
    });
    player.addListener("playback_error", ({ message }) => {
      console.error("Spotify Player playback error", message);
    });

    player.addListener("ready", ({ device_id }) => {
      console.info("Spotify Player ready, device id:", device_id);
      resolve({ player, deviceId: device_id });
    });

    player.addListener("not_ready", ({ device_id }) => {
      console.info("Spotify Player not ready, device id:", device_id);
    });

    player.connect().catch((err: unknown) => reject(err));
  });
};
