import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5001/api/profile', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading your profile...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome to Statify</h1>
          {profile && (
            <div className="user-profile">
              {profile.images && profile.images.length > 0 && (
                <img 
                  src={profile.images[0].url} 
                  alt={profile.display_name} 
                  className="profile-image" 
                />
              )}
              <h2>{profile.display_name}</h2>
              <p>{profile.followers.total} followers</p>
            </div>
          )}
        </div>
        
        <div className="dashboard-content">
          <div className="card">
            <h2>Explore Your Music</h2>
            <p>Discover insights about your listening habits and preferences.</p>
            <div className="card-links">
              <a href="/top-artists" className="dashboard-link">View Top Artists</a>
              <a href="/top-tracks" className="dashboard-link">View Top Tracks</a>
            </div>
          </div>
          
          <div className="stats-preview">
            <h2>Your Listening Overview</h2>
            <p>Connect with Spotify to see your personalised stats.</p>
            <p className="note">Statify analyses your Spotify data to show you interesting insights about your music taste.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
