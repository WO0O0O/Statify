import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TopItems.css';

const TopArtists = () => {
  const [artists, setArtists] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  useEffect(() => {
    const fetchTopArtists = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/top/artists?time_range=${timeRange}&limit=20`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch top artists');
        }
        
        const data = await response.json();
        setArtists(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopArtists();
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Loading your top artists...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="top-items-container">
      <div className="container">
        <h1 className="page-title">Your Top Artists</h1>
        
        <div className="time-range-selector">
          <p>Time Range:</p>
          <div className="time-range-buttons">
            {timeRanges.map(range => (
              <button
                key={range.value}
                className={`time-range-button ${timeRange === range.value ? 'active' : ''}`}
                value={range.value}
                onClick={handleTimeRangeChange}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="items-grid">
          {artists.map((artist, index) => (
            <div key={artist.id} className="item-card">
              <div className="item-rank">{index + 1}</div>
              {artist.images && artist.images.length > 0 ? (
                <img 
                  src={artist.images[0].url} 
                  alt={artist.name} 
                  className="item-image" 
                />
              ) : (
                <div className="item-image-placeholder">No Image</div>
              )}
              <div className="item-details">
                <h3 className="item-name">{artist.name}</h3>
                <p className="item-followers">{artist.followers.total.toLocaleString()} followers</p>
                <div className="item-genres">
                  {artist.genres.slice(0, 3).map((genre, i) => (
                    <span key={i} className="genre-tag">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {artists.length === 0 && (
          <div className="no-data">
            <p>No artist data available for this time period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopArtists;
