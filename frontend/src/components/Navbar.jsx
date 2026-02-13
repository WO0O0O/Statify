import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../styles/Navbar.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
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
            <Link to="/top-genres" className="navbar-link">Top Genres</Link>
          </li>
          <li className="navbar-item">
            <Link to="/top-artists" className="navbar-link">Top Artists</Link>
          </li>
          <li className="navbar-item">
            <Link to="/top-tracks" className="navbar-link">Top Tracks</Link>
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
