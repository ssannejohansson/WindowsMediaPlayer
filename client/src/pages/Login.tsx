import "./login.css";

export const Login = () => {
    const handleLogin = () => {
        window.location.href = "http://127.0.0.1:3001/auth/login"
    };

    return (
        <div className="login-container">
            {/* Windows flag logo */}
            <div className="login-flag">
                <div className="login-flag-red" />
                <div className="login-flag-green" />
                <div className="login-flag-blue" />
                <div className="login-flag-yellow" />
            </div>

            <p className="login-title">Spotify Clone</p>
            <p className="login-subtitle">All your music. Just like the 2000s.</p>

            <button type="button" className="login-btn" onClick={handleLogin}>
                <div className="login-btn-icon" />
                Log in with Spotify
            </button>
        </div>
    )
}
