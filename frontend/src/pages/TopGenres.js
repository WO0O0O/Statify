import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TopItems.css';

const TopGenres = () => {
  const [genres, setGenres] = useState([]);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const timeRanges = [
    { value: 'short_term', label: 'Last 4 Weeks' },
    { value: 'medium_term', label: 'Last 6 Months' },
    { value: 'long_term', label: 'All Time' }
  ];

  useEffect(() => {
    const fetchTopGenres = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/top-genres?time_range=${timeRange}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch top genres');
        }
        
        const data = await response.json();
        setGenres(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopGenres();
  }, [timeRange]);

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  if (isLoading) {
    return <div className="loading">Loading your top genres...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="top-items-container">
      <div className="container">
        <h1 className="page-title">Your Top Genres</h1>
        
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
        
        <div 
          className="genres-cloud" 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            padding: '20px',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          {genres.slice(0, 20).map((genre, index) => {
            // Calculate size based on frequency (relative to top genre)
            const maxCount = genres[0]?.count || 1;
            const fontSize = 14 + ((genre.count / maxCount) * 24);
            const intensity = Math.floor((genre.count / maxCount) * 255);
            
            // Generate a color based on the genre's popularity
            // More popular genres get more saturated colors
            const bgColor = `rgba(${30 + intensity}, ${70 + intensity * 0.5}, ${255 - intensity * 0.7}, 0.7)`;
            const textColor = intensity > 100 ? '#fff' : '#000';

            // Calculate a random position variation to create a more organic cloud
            const randomRotation = Math.floor(Math.random() * 5 - 2);
            
            return (
              <div 
                key={index} 
                className="genre-bubble"
                style={{ 
                  fontSize: `${fontSize}px`,
                  backgroundColor: bgColor,
                  color: textColor,
                  transform: `rotate(${randomRotation}deg)`,
                  padding: `${8 + (fontSize * 0.2)}px ${12 + (fontSize * 0.3)}px`,
                  margin: '8px',
                  borderRadius: '30px',
                  display: 'inline-block',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.05) !important',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = `scale(1.05) rotate(${randomRotation}deg)`;
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = `rotate(${randomRotation}deg)`;
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                }}
              >
                {genre.name}
              </div>
            );
          })}
        </div>
        
        {genres.length === 0 && (
          <div className="no-data">
            <p>No genre data available for this time period.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopGenres;