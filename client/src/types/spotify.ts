export interface Image {
    height?: number
    width?: number
    url: string
}

export interface Artist {
    external_urls: { spotify: string }
    href: string
    id: string
    name: string
    type: "artist"
    uri: string
}

export interface Album {
    album_type: "album" | "single" | "compilation"
    external_urls: { spotify: string }
    href: string
    id: string
    images: Image[]
    name: string
    release_date: string
    type: "album"
    uri: string
    artists: Artist[]
}

export interface Track {
    album: Album
    artists: Artist[]
    external_urls: { spotify: string }
    href: string
    id: string
    name: string
    popularity: number
    track_number: number
    type: "track"
    uri: string
    duration_ms: number
}

export interface PlaylistTrackItem {
    added_at: string
    item: Track | null  // null for local files or podcast episodes; Spotify API uses "item" not "track"
}

export interface Playlist {
    collaborative: boolean
    external_urls: { spotify: string }
    href: string
    id: string
    images: Image[]
    name: string
    owner: { external_urls: { spotify: string}; href: string; id: string; type: string; uri: string; display_name: string }
    public: boolean
    type: "playlist"
    uri: string
    // Spotify now uses "items" for both simplified (/me/playlists) and full (/playlists/:id) responses
    items?: { href: string; total: number; items?: PlaylistTrackItem[]; next?: string }
}
