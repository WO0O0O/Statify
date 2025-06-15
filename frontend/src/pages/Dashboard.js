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
        
        <div className="dashboard-intro">
          <h2>Your Music Insights Dashboard</h2>
          <p>Explore detailed statistics and visualisations of your Spotify listening habits</p>
        </div>
        
        <div className="feature-categories">
          {/* Top Stats Category */}
          <div className="feature-category">
            <h3 className="category-title">Top Stats</h3>
            <div className="feature-cards">
              <div className="feature-card">
                <div className="feature-icon">👨‍🎤</div>
                <h4>Top Artists</h4>
                <p>Discover your most-listened artists across different time periods.</p>
                <a href="/top-artists" className="feature-link">View Top Artists</a>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🎵</div>
                <h4>Top Tracks</h4>
                <p>See which songs you've had on repeat lately.</p>
                <a href="/top-tracks" className="feature-link">View Top Tracks</a>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🏷️</div>
                <h4>Top Genres</h4>
                <p>Explore your genre preferences and musical tastes.</p>
                <a href="/top-genres" className="feature-link">View Top Genres</a>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💿</div>
                <h4>Top Albums</h4>
                <p>Check which albums you've been streaming the most.</p>
                <a href="/top-albums" className="feature-link">View Top Albums</a>
              </div>
            </div>
          </div>
          
          {/* Audio Profile Category */}
          <div className="feature-category">
            <h3 className="category-title">Audio Profile</h3>
            <div className="feature-cards">
              <div className="feature-card coming-soon">
                <div className="feature-icon">📊</div>
                <h4>Audio Features</h4>
                <p>Analyze the musical attributes of your favorite tracks.</p>
                <span className="coming-soon-label">Coming Soon</span>
              </div>
              
              <div className="feature-card coming-soon">
                <div className="feature-icon">📈</div>
                <h4>Mood Radar</h4>
                <p>Visualize your listening patterns across different moods.</p>
                <span className="coming-soon-label">Coming Soon</span>
              </div>
            </div>
          </div>
          
          {/* Listening Habits Category */}
          <div className="feature-category">
            <h3 className="category-title">Listening Habits</h3>
            <div className="feature-cards">
              <div className="feature-card coming-soon">
                <div className="feature-icon">🕰️</div>
                <h4>Recently Played</h4>
                <p>Track your most recent listening activity.</p>
                <span className="coming-soon-label">Coming Soon</span>
              </div>
              
              <div className="feature-card coming-soon">
                <div className="feature-icon">📅</div>
                <h4>Era Preferences</h4>
                <p>Discover which decades and musical eras you prefer.</p>
                <span className="coming-soon-label">Coming Soon</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="dashboard-footer">
          <p className="note">Statify analyses your Spotify data to show you interesting insights about your music taste.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
