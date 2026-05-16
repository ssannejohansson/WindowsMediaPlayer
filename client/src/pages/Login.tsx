import "./login.css";

export const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://127.0.0.1:3001/auth/login"
    };

    return (
        <div className="login-container">
            <img src="/windows-logo.png" alt="Windows logo" className="login-windows-logo" />

            <p className="login-title">Spotify Clone</p>
            <p className="login-subtitle">All your music. Just like the 2000s.</p>

            <button type="button" className="login-btn" onClick={handleLogin}>
                <img src="/spotify-logo-black.png" alt="Spotify" className="login-btn-icon" />
                Log in with Spotify
            </button>
        </div>
    )
}
