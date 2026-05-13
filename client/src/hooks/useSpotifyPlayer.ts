import { useEffect } from "react";
import { initSpotifyPlayer } from "../lib/sdk";
import { usePlayerStore } from "../stores/usePlayerStore";

export const useSpotifyPlayer = () => {
    const setPlaybackState = usePLayerStore((s) => s.setPlaybackState);

    useEffect(() => {
        let mounted = true;
        let player: any = null;

        const start = async () => {
            try {
                player = await initSpotifyPlayer();
                player.addListener("ready", ({ device_id }: any) => {
                    if (!mounted) return;
                    setPlaybackState({ deviceId: device_id});
                });

                player.addListener("player_state_changed", (state: any) => {
                    if (!mounted || !state) return;
                    const isPlaying = !state.paused;
                    const track = state.track_window?.current_track ?? null;
                    setPlaybackState ({
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
                });
            } catch (err) {
                console.error("initSpotifyPlayer failed", err)
            };
        };

        start();
        return () => {
            mounted = false;
            if (player && player.disconnect) player.disconnect();
        }
    }, [setPlaybackState]);
    };
