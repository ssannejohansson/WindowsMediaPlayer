# Spotify WMP Clone — Phases 1–3

> Windows Media Player UI · React + Vite · TypeScript · Spotify Web API

---

## Phase 1 — OAuth + project setup

**Goal:** Runnable monorepo with Spotify login working end-to-end.

Status: phase 1 is implemented in code; this section reflects the current setup.

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
cp .env.example server/.env   # fill in SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, DATABASE_URL
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
2. `GET /auth/callback` — exchange code for tokens, fetch Spotify profile, store token row in DB, redirect to client
3. `POST /auth/refresh` — load the latest saved refresh token, refresh it, and update the DB row

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

`server/prisma/schema.prisma`:

```prisma
model Token {
  id           String   @id @default(cuid())
  spotifyId    String   @unique
  accessToken  String
  refreshToken String
  expiresAt    DateTime
  scope        String?
  tokenType    String   @default("Bearer")
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

### 1.6 Auth state on the client

```
client/src/stores/useAuthStore.ts   — { user, accessToken, setAuth, clearAuth }
client/src/pages/Login.tsx          — WMP splash screen + "Log in with Spotify" button
```

The login button redirects to `http://127.0.0.1:3001/auth/login`. After the OAuth callback the server redirects back to the client with the token and Spotify profile details.

### Phase 1 checklist

- [x] `npm run dev` starts the backend (:3001) and the client on `127.0.0.1` in the current dev setup
- [x] Clicking "Log in with Spotify" redirects to Spotify and back
- [x] Access token is stored and readable from `useAuthStore`
- [x] WMP window chrome renders on the login screen

---

## Phase 2 — Spotify API layer

**Goal:** All Spotify data accessible through typed hooks. Web Playback SDK initialised.

Status: phase 2 is implemented in code; this section reflects the current setup.

### 2.1 Axios client with token refresh

`client/src/lib/spotify.ts`:

```ts
// Axios instance that reads the token from Zustand
// Request interceptor → attaches Authorization: Bearer <token>
// Response interceptor → on 401, calls /auth/refresh then retries
const spotifyClient = axios.create({
  baseURL: "https://api.spotify.com/v1",
});
```

The current client implementation also exposes the playback helper API in `client/src/lib/playerApi.ts`, which wraps `/me/player` actions like play, pause, skip, and device transfer.

### 2.2 React Query hooks

```
client/src/hooks/
  useSearch.ts    — GET /search?q=&type=track,artist,album
  useLibrary.ts   — GET /me/tracks for liked songs
  usePlaylist.ts  — GET /playlists/:id plus user playlists via useUserPlaylists()
  useSpotifyPlayer.ts — Web Playback SDK setup + device registration
```

Set `staleTime: 1000 * 60` (1 min) on each query to avoid hammering the API.

### 2.3 Spotify types

`client/src/types/spotify.ts`:

```ts
interface Track {
  id: string;
  name: string;
  duration_ms: number;
  artists: Artist[];
  album: Album;
  uri: string;
}

interface Artist {
  id: string;
  name: string;
  images: Image[];
}
interface Album {
  id: string;
  name: string;
  images: Image[];
  release_date: string;
}
interface Image {
  url: string;
  width: number;
  height: number;
}
interface Playlist {
  id: string;
  name: string;
  tracks: { total: number };
}
```

The concrete type file currently includes `Track`, `Artist`, `Album`, `Image`, `Playlist`, and `SearchResponse` to support the implemented hooks and UI.

### 2.4 Zustand player store

`client/src/stores/usePlayerStore.ts`:

```ts
interface PlayerState {
  isPlaying: boolean;
  deviceId: string | null;
  currentTrack: {
    id: string;
    name: string;
    duration_ms: number;
    artists: { id: string; name: string }[];
    album: { id: string; name: string };
  } | null;
  progressMs: number | null;
  setPlaybackState: (payload: Partial<PlayerState>) => void;
  clearPlayback: () => void;
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

The SDK is currently initialised from `useSpotifyPlayer()` in `client/src/hooks/useSpotifyPlayer.ts` and used by `client/src/pages/NowPlaying.tsx`.

### Phase 2 checklist

- [x] `useSearch('blinding lights')` returns typed results
- [x] `useLibrary()` returns the user's liked songs
- [x] `useUserPlaylists()` returns the user's playlists
- [x] Web Playback SDK device is registered and `deviceId` is in the store
- [x] Calling `play(track)` starts audio in the browser

---

## Phase 3 — Core UI

**Goal:** Core Windows Media Player screens wired up with shared routing and player UI.

Status: phase 3 is the next UI layer to build; the current app already has the login, callback, search, library placeholder, and now playing routes in place.

### 3.1 App layout + routing

`client/src/App.tsx` route structure:

```
/               → Login (unauthenticated) or redirect to /library
/library        → Library
/search         → Search
/now-playing    → NowPlaying
/auth/callback  → OAuth token handoff
```

Wrap authenticated routes in a guard that checks `useAuthStore`.

Planned next routes once phase 3 starts:

```
/playlist/:id   → Playlist
/equalizer      → Equalizer
```

### 3.2 Persistent PlayerBar

Mount `<PlayerBar />` outside the route outlet so it persists across navigation — just like WMP's transport controls stay visible while browsing.

```
client/src/components/player/
  PlayerBar.tsx      — play/pause, prev, next, shuffle, repeat
  ProgressBar.tsx    — scrubber + elapsed / total time
  VolumeControl.tsx  — volume slider
```

These player components are not implemented yet; they are the next files to add in phase 3.

### 3.3 Pages

| Page               | Key components                                 | Data source |
| ------------------ | ---------------------------------------------- | ----------- |
| `Login.tsx`        | WMP logo, tagline, OAuth button                | done        |
| `AuthCallback.tsx` | OAuth token handoff and redirect to library    | done        |
| `Search.tsx`       | Search input, tabs (Tracks / Artists / Albums) | done        |
| `NowPlaying.tsx`   | Track info, controls, device status            | done        |
| `Library.tsx`      | Recently added grid, playlist sidebar          | planned     |
| `Playlist.tsx`     | Track list with #, title, artist, duration     | planned     |
| `Equalizer.tsx`    | 10-band EQ sliders, balance, presets dropdown  | planned     |

### 3.4 WMP styling notes

- Window chrome: `2px` inset border, `#ece9d8` background, `#d4d0c8` button borders
- Title bar: deep blue (`#0a246a`), white 11px Tahoma text, classic min/max/close icons
- Buttons: flat gray with inset press effect on `:active`
- Track rows: alternating white / `#f5f5f5`, selection highlight `#316ac5`
- Font: `Tahoma, sans-serif` — the authentic WMP/XP typeface

### Phase 3 checklist

- [x] Current implemented routes render without errors
- [x] Login, callback, search, now-playing, and library placeholder routes exist
- [x] Library shows real playlists and liked songs from Spotify
- [x] Playlist detail page with track list (#, title, artist, duration)
- [x] Equalizer page with 10-band sliders and presets
- [x] PlayerBar plays, pauses, and skips tracks with progress scrubber
- [x] NowPlaying page shows album art and track info
- [x] UI looks recognisably like Windows Media Player

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

- Client → `http://127.0.0.1:5175` in the current dev setup
- Server → `http://127.0.0.1:3001`
- Prisma Studio → `http://localhost:5555` (`npm run db:studio`)

If you want the current working setup exactly as used during development, run the frontend with:

```bash
cd client
npm run dev -- --host 127.0.0.1 --port 5175
```

---

## Phase 4 — Library interactions
 
**Goal:** Add the interactions that look great in a portfolio demo without over-engineering. Playlist CRUD is skipped — the focus is on visible, impressive features a recruiter will actually notice.
 
### 4.1 Liked songs toggle
 
Add a heart icon to every `TrackRow` component. Clicking it calls `PUT /me/tracks` or `DELETE /me/tracks` and optimistically updates the UI so it feels instant.
 
```
client/src/hooks/useLikedSongs.ts   — isLiked(id), like(id), unlike(id)
```
 
Optimistic update pattern with React Query:
```ts
// On like: immediately set heart to filled, rollback on error
useMutation({
  mutationFn: likeTrack,
  onMutate: async (id) => { /* update cache */ },
  onError:   (err, id, ctx) => { /* rollback */ },
})
```
 
### 4.2 Recently played
 
```
client/src/hooks/useRecentlyPlayed.ts   — GET /me/player/recently-played
```
 
Show the last 10 tracks at the top of the Library page in a horizontally scrolling strip — matching the "Recently Added" section from the wireframe.
 
### 4.3 Responsive compact WMP skin
 
When the viewport is narrower than `768px`, collapse the full window chrome into a compact mobile skin:
- Hide the sidebar
- Show a slim PlayerBar with just album art, track name, and play/pause
- Tap album art to expand to NowPlaying full screen
### Phase 4 checklist
- [~] Heart icon toggle — removed; Spotify returns 403 "Forbidden" on library write endpoints in dev mode regardless of scopes, not worth the debugging cost for a portfolio project
- [x] Recently played strip shows on Library page
- [x] Compact mobile skin renders on narrow viewports
- [x] Mobile: full-screen WMP window, slim PlayerBar with art + track name, tap to open NowPlaying
- [x] OAuth login flow fixed (window.location.replace redirect, 127.0.0.1 host)
---
 
## Phase 5 — Polish + UX
 
**Goal:** The app feels complete and portfolio-ready. Animations, error states, and loading skeletons throughout.
 
### 5.1 Loading skeletons
 
Replace every spinner with a proper skeleton that mirrors the shape of the content it's loading. WMP style — gray shimmer boxes where album art and track rows will appear.
 
```
client/src/components/ui/
  SkeletonTrackRow.tsx   — mimics TrackRow dimensions
  SkeletonAlbumCard.tsx  — mimics AlbumCard dimensions
  SkeletonText.tsx       — generic line placeholder
```
 
### 5.2 Error states
 
Every React Query hook should have an `onError` fallback that renders a WMP-style error dialog:
 
```
client/src/components/ui/
  ErrorDialog.tsx   — WMP error popup with icon + retry button
```
 
### 5.3 Animations
 
Add subtle transitions to make the UI feel alive without breaking the retro aesthetic:
- Page transitions — fade in on route change (100ms)
- Track row hover — background slides in
- PlayerBar track change — album art cross-fades
- Playlist modal — slides up from bottom
Use CSS transitions rather than a library to keep the bundle lean.
 
### 5.4 Keyboard shortcuts
 
Replicate classic WMP keyboard shortcuts:
 
| Key | Action |
|---|---|
| `Space` | Play / pause |
| `Ctrl + Right` | Next track |
| `Ctrl + Left` | Previous track |
| `Ctrl + Up/Down` | Volume up / down |
| `Ctrl + F` | Focus search |
 
Add a `useKeyboardShortcuts` hook in `client/src/hooks/` that registers these on `window`.
 
### 5.5 Winston logging review
 
Review the server logs — make sure every Express route logs request method, path, status code, and duration. Add a `morgan`-style middleware or wire it directly into Winston.
 
### Phase 5 checklist
- [x] No bare spinners remain — Library and Playlist replaced with shimmer skeletons
- [x] Error states show a WMP-style error dialog with retry (Library, Playlist)
- [x] Page transitions — fade in on route change (120ms)
- [~] Keyboard shortcuts — skipped, not impactful for portfolio
- [~] Winston logging review — skipped, not impactful for portfolio
---
 
## Phase 6 — Deployment
 
**Goal:** The app is live, shareable, and stable enough to put on your portfolio.
 
### 6.1 Environment setup
 
Create production `.env` files for both client and server. The client only needs `VITE_API_BASE_URL` pointing to the deployed server URL.
 
```bash
# client/.env.production
VITE_API_BASE_URL=https://your-server-url.com
```
 
### 6.2 Deploy the server
 
Deploy the Express server to **Railway** or **Render** (both have free tiers and support Node + PostgreSQL):
 
1. Push the repo to GitHub
2. Connect the `main` branch to Railway/Render
3. Add environment variables in the dashboard
4. Run `npm run db:migrate` via the platform's shell
### 6.3 Deploy the client
 
Deploy the React + Vite client to **Vercel** or **Netlify**:
 
1. Connect the GitHub repo
2. Set build command: `npm run build -w client`
3. Set output directory: `client/dist`
4. Add `VITE_API_BASE_URL` as an environment variable
### 6.4 Update Spotify app settings
 
In your Spotify Developer Dashboard, add the production callback URL:
 
```
https://your-server-url.com/auth/callback
```
 
Without this, OAuth will fail in production.
 
### 6.5 Spotify Development Mode limit
 
Remember — your app is limited to 5 users in Development Mode. For a portfolio project that's fine. If you want more users you'll need to apply for Spotify's Extended Quota Mode, which requires a description of your use case.
 
### 6.6 README
 
Write a `README.md` in the repo root covering:
- What the project is and a screenshot
- Tech stack
- Local setup instructions
- Link to the live demo
A good README is as important as the code for a portfolio piece.
 
### Phase 6 checklist
- [ ] Server deployed and `/auth/login` works in production
- [ ] Client deployed and loads without errors
- [ ] Spotify OAuth callback URL updated in Developer Dashboard
- [ ] `README.md` written with screenshot and live demo link
- [ ] Live URL added to your GitHub repo and CV