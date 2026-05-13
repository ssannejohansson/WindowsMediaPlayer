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
    tracks: { href: string; total: number }
}

export interface SearchResponse {
    tracks?: { items: Track[] }
    artists?: {items: Artist[] }
    albums?: { items: Album[] }
    playlists?: { items: Playlist[] }
}