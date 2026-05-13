export const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://127.0.0.1:3001/auth/login"
    };
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-3xl font-bold text-wmp-blue mb-8">Windows Media Player</h1>
            <p className="text-wmp-textMuted">Spotify Clone</p>
            <button 
                onClick={handleLogin}
                className="px-8 py-3 bg-wmp-green text-white font-semibold rounded hover:opacity-90">
                Log in with Spotify
            </button>
        </div>
    )
}