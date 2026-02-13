import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TopItems.css';

const TopTracks = () => {
  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  useEffect(() => {
    const fetchTopTracks = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/top/tracks?time_range=${timeRange}&limit=20`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch top tracks');
        }
        
        const data = await response.json();
        setTracks(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopTracks();
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (isLoading) {
    return <div className="loading">Loading your top tracks...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="top-items-container">
      <div className="container">
        <h1 className="page-title">Your Top Tracks</h1>
        
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
          {tracks.map((track, index) => (
            <div key={track.id} className="item-card">
              <div className="item-rank">{index + 1}</div>
              {track.album.images && track.album.images.length > 0 ? (
                <img 
                  src={track.album.images[0].url} 
                  alt={track.name} 
                  className="item-image" 
                />
              ) : (
                <div className="item-image-placeholder">No Image</div>
              )}
              <div className="item-details">
                <h3 className="item-name">{track.name}</h3>
                <p className="item-artist">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
                <p className="item-album">{track.album.name}</p>
                <p className="item-duration">{formatDuration(track.duration_ms)}</p>
              </div>
            </div>
          ))}
        </div>
        
        {tracks.length === 0 && (
          <div className="no-data">
            <p>No track data available for this time period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopTracks;
