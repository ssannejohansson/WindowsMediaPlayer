import { useAuthStore } from '../stores/useAuthStore.js'

// Load the Spotify Web Playback SDK script
export const loadSpotifySDK = (): Promise<void> =>
  new Promise((resolve) => {
    if ((window as any).Spotify) return resolve()
    const s = document.createElement('script')
    s.src = 'https://sdk.scdn.co/spotify-player.js'
    s.async = true
    s.onload = () => resolve()
    document.body.appendChild(s)
  })

// Initialize a Spotify Player instance. Returns the player once ready.
export const initSpotifyPlayer = async (name = 'WMP Player') => {
  await loadSpotifySDK()
  const token = useAuthStore.getState().accessToken
  if (!token) throw new Error('No access token available for Spotify Player')

  return new Promise<any>((resolve, reject) => {
    const PlayerCtor = (window as any).Spotify?.Player
    if (!PlayerCtor) return reject(new Error('Spotify Player constructor not found'))

    const player = new PlayerCtor({
      name,
      getOAuthToken: (cb: (t: string) => void) => cb(token),
    })

    player.addListener('initialization_error', ({ message }: any) => {
      console.error('Spotify Player init error', message)
      reject(new Error(message))
    })
    player.addListener('authentication_error', ({ message }: any) => {
      console.error('Spotify Player auth error', message)
      reject(new Error(message))
    })
    player.addListener('account_error', ({ message }: any) => {
      console.error('Spotify Player account error', message)
    })
    player.addListener('playback_error', ({ message }: any) => {
      console.error('Spotify Player playback error', message)
    })

    player.addListener('ready', ({ device_id }: any) => {
      console.info('Spotify Player ready, device id:', device_id)
      resolve(player)
    })

    player.addListener('not_ready', ({ device_id }: any) => {
      console.info('Spotify Player not ready, device id:', device_id)
    })

    player.connect().catch((err: any) => reject(err))
  })
}
