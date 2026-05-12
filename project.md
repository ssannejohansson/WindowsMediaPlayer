# Spotify WMP Clone — Phases 1–3

> Windows Media Player UI · React + Vite · TypeScript · Spotify Web API

---

## Phase 1 — OAuth + project setup

**Goal:** Runnable monorepo with Spotify login working end-to-end.

### 1.1 Bootstrap the client

```bash
cd client
npm create vite@latest . -- --template react-ts
```

Create the entry files:

- `client/src/main.tsx` — render `<App />` wrapped in `QueryClientProvider` and `BrowserRouter`
- `client/src/App.tsx` — define routes and the top-level `WindowFrame` layout shell

### 1.2 Tailwind + WMP theme

```bash
npm install -w client tailwindcss postcss autoprefixer
npx tailwindcss init -p --cwd client
```

In `client/tailwind.config.ts`, extend the theme with WMP-inspired tokens:

```ts
colors: {
  wmp: {
    blue:      '#0a246a', // title bar
    blueLight: '#3a6ea5', // title bar gradient end
    gray:      '#ece9d8', // window background
    grayDark:  '#d4d0c8', // button / border
    silver:    '#f0eeea',
    text:      '#000000',
    textMuted: '#6e6e6e',
    green:     '#1db954', // Spotify accent
  }
}
```

### 1.3 WMP chrome components

Create the reusable window shell that wraps every screen:

```
client/src/components/wmp/
  WindowFrame.tsx   — outer border, title bar, menu bar, content slot
  TitleBar.tsx      — "Windows Media Player" title + min/max/close buttons
  MenuBar.tsx       — File · View · Play · Tools · Help items
```

`WindowFrame` accepts a `title` prop and a `children` slot. Every page renders inside it.

### 1.4 Express server + Spotify OAuth

```bash
cp .env.example server/.env   # fill in CLIENT_ID, CLIENT_SECRET, DATABASE_URL
```

Create these files:

```
server/src/
  index.ts          — Express app, mounts routes, starts on PORT
  routes/auth.ts    — GET /auth/login, GET /auth/callback, POST /auth/refresh
  lib/spotify.ts    — token exchange + refresh helpers
  lib/logger.ts     — Winston instance (console + file transports)
```

**OAuth flow (Authorization Code):**

1. `GET /auth/login` — redirect to Spotify authorize URL with scopes
2. `GET /auth/callback` — exchange code for tokens, store in DB, redirect to client
3. `POST /auth/refresh` — use stored refresh token to get a new access token

Required Spotify scopes:
```
streaming
user-read-email
user-read-private
user-read-playback-state
user-modify-playback-state
user-library-read
playlist-read-private
```

### 1.5 Prisma setup

```bash
npm run db:generate -w server
npm run db:migrate -w server
```

`server/src/prisma/schema.prisma`:

```prisma
model User {
  id          String  @id @default(cuid())
  spotifyId   String  @unique
  email       String?
  displayName String?
  token       Token?
}

model Token {
  id           String   @id @default(cuid())
  userId       String   @unique
  accessToken  String
  refreshToken String
  expiresAt    DateTime
  user         User     @relation(fields: [userId], references: [id])
}
```

### 1.6 Auth state on the client

```
client/src/stores/useAuthStore.ts   — { user, accessToken, setAuth, clearAuth }
client/src/pages/Login.tsx          — WMP splash screen + "Log in with Spotify" button
```

The login button redirects to `http://localhost:3001/auth/login`. After the OAuth callback the server redirects back to the client with the token.

### Phase 1 checklist
- [ ] `npm run dev` starts both client (:5173) and server (:3001)
- [ ] Clicking "Log in with Spotify" redirects to Spotify and back
- [ ] Access token is stored and readable from `useAuthStore`
- [ ] WMP window chrome renders on the login screen

---

## Phase 2 — Spotify API layer

**Goal:** All Spotify data accessible through typed hooks. Web Playback SDK initialised.

### 2.1 Axios client with token refresh

`client/src/lib/spotify.ts`:

```ts
// Axios instance that reads the token from Zustand
// Request interceptor → attaches Authorization: Bearer <token>
// Response interceptor → on 401, calls /auth/refresh then retries
const spotifyClient = axios.create({
  baseURL: 'https://api.spotify.com/v1',
})
```

### 2.2 React Query hooks

```
client/src/hooks/
  useSearch.ts    — GET /search?q=&type=track,artist,album
  useLibrary.ts   — GET /me/tracks + GET /me/playlists
  usePlaylist.ts  — GET /playlists/:id/tracks
  usePlayer.ts    — playback controls via SDK
```

Set `staleTime: 1000 * 60` (1 min) on each query to avoid hammering the API.

### 2.3 Spotify types

`client/src/types/spotify.ts`:

```ts
interface Track {
  id:          string
  name:        string
  duration_ms: number
  artists:     Artist[]
  album:       Album
  uri:         string
}

interface Artist   { id: string; name: string; images: Image[] }
interface Album    { id: string; name: string; images: Image[]; release_date: string }
interface Image    { url: string; width: number; height: number }
interface Playlist { id: string; name: string; tracks: { total: number } }
```

### 2.4 Zustand player store

`client/src/stores/usePlayerStore.ts`:

```ts
interface PlayerState {
  isPlaying:    boolean
  currentTrack: Track | null
  queue:        Track[]
  deviceId:     string | null
  volume:       number
  position:     number  // ms
  duration:     number  // ms
  setPlay:      (track: Track) => void
  setPause:     () => void
  nextTrack:    () => void
  prevTrack:    () => void
  setDeviceId:  (id: string) => void
  setPosition:  (ms: number) => void
}
```

### 2.5 Web Playback SDK

`client/src/lib/sdk.ts`:

```ts
// Injects the Spotify SDK <script> into <head>
// window.onSpotifyWebPlaybackSDKReady → creates Player instance
// player.on('ready') → saves deviceId to usePlayerStore
// player.on('player_state_changed') → syncs isPlaying, currentTrack, position
```

Call `initSDK()` once inside `App.tsx` after the user is authenticated.

### Phase 2 checklist
- [ ] `useSearch('blinding lights')` returns typed results
- [ ] `useLibrary()` returns the user's playlists and liked songs
- [ ] Web Playback SDK device is registered and `deviceId` is in the store
- [ ] Calling `play(track)` starts audio in the browser

---

## Phase 3 — Core UI

**Goal:** All screens built and navigable. Looks and feels like Windows Media Player.

### 3.1 App layout + routing

`client/src/App.tsx` route structure:

```
/               → Login (unauthenticated) or redirect to /library
/library        → Library
/search         → Search
/now-playing    → NowPlaying
/playlist/:id   → Playlist
/equalizer      → Equalizer
```

Wrap authenticated routes in a guard that checks `useAuthStore`.

### 3.2 Persistent PlayerBar

Mount `<PlayerBar />` outside the route outlet so it persists across navigation — just like WMP's transport controls stay visible while browsing.

```
client/src/components/player/
  PlayerBar.tsx      — play/pause, prev, next, shuffle, repeat
  ProgressBar.tsx    — scrubber + elapsed / total time
  VolumeControl.tsx  — volume slider
```

### 3.3 Pages

| Page | Key components | Data source |
|---|---|---|
| `Login.tsx` | WMP logo, tagline, OAuth button | — |
| `Library.tsx` | Recently added grid, playlist sidebar | `useLibrary()` |
| `Search.tsx` | Search input, tabs (Tracks / Artists / Albums) | `useSearch()` |
| `NowPlaying.tsx` | Album art, track info, controls, bitrate display | `usePlayerStore` |
| `Playlist.tsx` | Track list with #, title, artist, duration | `usePlaylist(id)` |
| `Equalizer.tsx` | 10-band EQ sliders, balance, presets dropdown | local state |

### 3.4 WMP styling notes

- Window chrome: `2px` inset border, `#ece9d8` background, `#d4d0c8` button borders
- Title bar: deep blue (`#0a246a`), white 11px Tahoma text, classic min/max/close icons
- Buttons: flat gray with inset press effect on `:active`
- Track rows: alternating white / `#f5f5f5`, selection highlight `#316ac5`
- Font: `Tahoma, sans-serif` — the authentic WMP/XP typeface

### Phase 3 checklist
- [ ] All 6 routes render without errors
- [ ] Library shows real playlists from Spotify
- [ ] Search returns and displays results
- [ ] PlayerBar plays, pauses, and skips tracks
- [ ] UI looks recognisably like Windows Media Player

---

## Running the project

```bash
# Install everything from the root
npm install

# Copy and fill in your secrets
cp .env.example server/.env

# Start both client + server
npm run dev

# First-time database setup
npm run db:migrate
```

**Ports:**
- Client → `http://localhost:5173`
- Server → `http://localhost:3001`
- Prisma Studio → `http://localhost:5555` (`npm run db:studio`)

---

## Phase 4 preview

Phase 4 covers the social layer: playlist CRUD, liked songs toggle, recently played history, and the responsive compact WMP skin for mobile. Once phases 1–3 are solid, phase 4 is mostly additive.