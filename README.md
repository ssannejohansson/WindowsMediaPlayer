# Windows Media Player — Spotify Clone

A Spotify client built to look and feel like Windows Media Player from the early 2000s. Browse your library, play tracks, and view playlists — all wrapped in a faithful WMP chrome complete with title bar, menu bar, and a Windows-style desktop taskbar.

---

## Features

- **Spotify OAuth login** — authorise with your Spotify account via Authorization Code flow
- **Library** — recently played strip, liked songs list, and your playlists
- **Playlist detail** — full track list with track number, title, artist, and duration
- **Now Playing** — full-screen album art with track and artist info
- **Persistent player bar** — play, pause, stop, skip, progress scrubber, and volume control
- **WMP chrome** — title bar, menu bar, min/max/close buttons, inset/outset borders throughout
- **Windows desktop** — taskbar with Start button, quick launch icons, and a live clock
- **Loading skeletons** — shimmer placeholders while data loads
- **Error states** — WMP-style error dialogs with retry
- **Page transitions** — subtle fade on route change
- **Responsive** — compact mobile skin with slim player bar

---

## Tech stack

**Client**
- React 19 + TypeScript
- Vite
- React Router v7
- TanStack Query v5
- Zustand
- Tailwind CSS v4
- Spotify Web Playback SDK

**Server**
- Node.js + Express
- TypeScript + tsx
- Prisma + SQLite
- Winston (logging)

---

## Local setup

### Prerequisites

- Node.js 18+
- A [Spotify Developer](https://developer.spotify.com/dashboard) app with the redirect URI set to `http://127.0.0.1:3001/auth/callback`

### Install

```bash
git clone https://github.com/ssannejohansson/WindowsMediaPlayer.git
cd WindowsMediaPlayer
npm install
```

### Configure

```bash
cp server/.env.example server/.env
```

Fill in your credentials in `server/.env`:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3001/auth/callback
DATABASE_URL=file:./prisma/dev.db
CLIENT_URL=http://127.0.0.1:5173
```

### Run

```bash
# Set up the database
npm run db:migrate -w server

# Start client + server
npm run dev
```

- Client → `http://127.0.0.1:5173`
- Server → `http://127.0.0.1:3001`

---

## Project structure

```
├── client/               # React + Vite frontend
│   ├── src/
│   │   ├── components/   # WMP chrome, player bar, UI primitives
│   │   ├── hooks/        # React Query data hooks
│   │   ├── pages/        # Library, Playlist, NowPlaying, Login
│   │   ├── stores/       # Zustand (auth + player state)
│   │   ├── lib/          # Spotify API client, SDK, player actions
│   │   └── types/        # Spotify API types
│   └── public/           # Static assets (icons, background)
├── server/               # Express backend
│   ├── src/
│   │   ├── routes/       # OAuth endpoints
│   │   └── lib/          # Token exchange, Spotify helpers
│   └── prisma/           # Schema + SQLite database
└── docs/
    └── wireframes/       # Original design wireframes
```

---

## Notes

- The app is limited to **25 users** in Spotify Development Mode. Add users in the Spotify Developer Dashboard under *User Management*.
- Icons sourced from [win98icons.alexmeub.com](https://win98icons.alexmeub.com/)
