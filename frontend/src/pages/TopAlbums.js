import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TopItems.css';

const TopAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  useEffect(() => {
    const fetchTopAlbums = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/top-albums?time_range=${timeRange}&limit=50`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch top albums');
        }
        
        const data = await response.json();
        setAlbums(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopAlbums();
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Loading your top albums...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="top-items-container">
      <div className="container">
        <h1 className="page-title">Your Top Albums</h1>
        
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
          {albums.map((album, index) => (
            <div key={album.id} className="item-card album-card">
              <div className="item-rank">{index + 1}</div>
              {album.images && album.images.length > 0 ? (
                <img 
                  src={album.images[0].url} 
                  alt={album.name} 
                  className="item-image" 
                />
              ) : (
                <div className="item-image-placeholder">No Image</div>
              )}
              <div className="item-details">
                <h3 className="item-name">{album.name}</h3>
                <p className="item-artist">{album.artists.join(', ')}</p>
                <p className="item-release-date">Released: {new Date(album.release_date).getFullYear()}</p>
                <p className="item-track-count">{album.tracks.length} tracks from this album</p>
              </div>
            </div>
          ))}
        </div>
        
        {albums.length === 0 && (
          <div className="no-data">
            <p>No album data available for this time period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopAlbums;