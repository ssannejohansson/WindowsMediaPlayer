import { useEffect } from "react";
import { initSpotifyPlayer } from "../lib/sdk.js";
import { transferPlayback } from "../lib/playerApi.js";
import { usePlayerStore } from "../stores/usePlayerStore.js";

type SpotifyPlayerReady = { device_id: string };

type SpotifyPlayerTrack = {
  id: string;
  name: string;
  duration_ms: number;
  artists: Array<{ id: string; name: string }>;
  album: { id: string; name: string };
};

type SpotifyPlayerState = {
  paused: boolean;
  position: number;
  track_window?: {
    current_track?: SpotifyPlayerTrack | null;
  };
};

type SpotifyPlayer = {
  addListener: {
    (event: "ready", callback: (data: SpotifyPlayerReady) => void): void;
    (
      event: "player_state_changed",
      callback: (state: SpotifyPlayerState | null) => void,
    ): void;
  };
  disconnect: () => void;
};

export const useSpotifyPlayer = () => {
  const setPlaybackState = usePlayerStore((s) => s.setPlaybackState);

  useEffect(() => {
    let mounted = true;
    let player: SpotifyPlayer | null = null;

    const start = async () => {
      try {
        const { player: p, deviceId: device_id } = await initSpotifyPlayer();
        player = p as SpotifyPlayer;

        if (!mounted) return;

        // Act on the initial ready event — the promise already resolved inside
        // the SDK's "ready" listener so we can't catch it via addListener here.
        setPlaybackState({ deviceId: device_id });
        try {
          await transferPlayback(device_id, true);
        } catch (err) {
          console.error("transferPlayback failed", err);
        }

        // Handle reconnects (e.g. device going offline and coming back).
        player.addListener(
          "ready",
          async ({ device_id: id }: SpotifyPlayerReady) => {
            if (!mounted) return;
            setPlaybackState({ deviceId: id });
            try {
              await transferPlayback(id, true);
            } catch (err) {
              console.error("transferPlayback failed", err);
            }
          },
        );

        player.addListener(
          "player_state_changed",
          (state: SpotifyPlayerState | null) => {
            if (!mounted || !state) return;
            const isPlaying = !state.paused;
            const track = state.track_window?.current_track ?? null;
            setPlaybackState({
              isPlaying,
              currentTrack: track
                ? {
                    id: track.id,
                    name: track.name,
                    duration_ms: track.duration_ms,
                    artists: track.artists,
                    album: track.album,
                  }
                : null,
              progressMs: state.position ?? 0,
            });
          },
        );
      } catch (err) {
        console.error("initSpotifyPlayer failed", err);
      }
    };

    start();
    return () => {
      mounted = false;
      if (player && player.disconnect) player.disconnect();
    };
  }, [setPlaybackState]);
};
