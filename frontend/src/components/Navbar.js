import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:5001/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
      // Call the onLogout prop to update parent state
      if (onLogout) onLogout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/dashboard">Statify</Link>
        </div>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          </li>
          <li className="navbar-item">
            <Link to="/top-artists" className="navbar-link">Top Artists</Link>
          </li>
          <li className="navbar-item">
            <Link to="/top-tracks" className="navbar-link">Top Tracks</Link>
          </li>
          <li className="navbar-item">
            <Link to="/top-genres" className="navbar-link">Top Genres</Link>
          </li>
          <li className="navbar-item">
            <Link to="/top-albums" className="navbar-link">Top Albums</Link>
          </li>
          <li className="navbar-item">
            <button onClick={handleLogout} className="navbar-link logout-btn">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
