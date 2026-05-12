export const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold text-wmp-text">Windows Media Player</h1>
            <p className="text-wmp-textMuted">Spotify Clone</p>
            <button className="px-4 py-2 bg-wmp-green text-white rounded hover:opacity-90">
                Log in with Spotify
            </button>
        </div>
    )
}