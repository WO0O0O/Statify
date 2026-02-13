import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import '../styles/TopItems.css';
import '../styles/TopGenres.css';

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
        const response = await fetch(
          `${API_BASE_URL}/api/top-genres?time_range=${timeRange}`,
          { credentials: 'include' }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch top genres');
        }

        const data = await response.json();
        setGenres(data.genres || []);
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

  const maxCount = genres.length > 0 ? genres[0].count : 1;
  const totalCount = genres.reduce((sum, g) => sum + g.count, 0);
  const topFive = genres.slice(0, 5);
  const chartGenres = genres.slice(0, 15);

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

        {/* Big text top 5 */}
        <div className="top-five-genres">
          {topFive.map((genre, index) => (
            <div key={genre.name} className={`top-genre-item rank-${index + 1}`}>
              <span className="top-genre-rank">#{index + 1}</span>
              <span className="top-genre-name">{genre.name}</span>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="genre-chart">
          <h2 className="chart-title">Genre Breakdown</h2>
          <div className="chart-bars">
            {chartGenres.map((genre, index) => (
              <div key={genre.name} className="chart-row">
                <div className="chart-label">{genre.name}</div>
                <div className="chart-bar-container">
                  <div
                    className="chart-bar"
                    style={{
                      width: `${(genre.count / maxCount) * 100}%`,
                      animationDelay: `${index * 0.05}s`
                    }}
                  />
                </div>
                <div className="chart-value">{Math.round((genre.count / totalCount) * 100)}%</div>
              </div>
            ))}
          </div>
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
