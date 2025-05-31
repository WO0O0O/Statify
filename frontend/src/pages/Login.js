import React from 'react';
import '../styles/Login.css';

const Login = () => {
  const handleLogin = () => {
    // Redirect to backend auth endpoint
    window.location.href = 'http://127.0.0.1:5001/auth/login';
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1 className="login-title">Statify</h1>
        <p className="login-subtitle">Discover your Spotify listening habits</p>
        <button onClick={handleLogin} className="btn btn-primary login-button">
          Login with Spotify
        </button>
        <div className="login-info">
          <p>See your top artists, tracks, and more!</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
