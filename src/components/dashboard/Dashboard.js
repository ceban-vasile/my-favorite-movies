import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { movieService } from '../../services/api';
import MovieCard from './MovieCard';
import './Dashboard.css';

function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getUserMovies();
        setMovies(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleRemoveMovie = async (id) => {
    try {
      await movieService.deleteMovie(id);
      setMovies(movies.filter(movie => movie.id !== id));
    } catch (error) {
      setError('Failed to remove movie. Please try again.');
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Favorite Movies</h1>
        <Link to="/explore" className="explore-button">
          Explore Movies
        </Link>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {movies.length === 0 ? (
        <div className="no-movies">
          <p>You haven't added any favorite movies yet.</p>
          <Link to="/explore" className="explore-button">
            Start Exploring Movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id} 
              movie={movie} 
              onRemove={() => handleRemoveMovie(movie.id)} 
              isFavorite={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
