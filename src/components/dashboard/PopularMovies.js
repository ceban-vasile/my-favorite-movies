import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPopularMovies, addMovie, getUserMovies } from '../../services/movieService';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const PopularMovies = ({ setUserMovies }) => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Fetch popular movies on component mount
    if (user) {
      const topMovies = getPopularMovies(user.id);
      setPopularMovies(topMovies);
      setLoading(false);
    }
  }, [user]);

  const addToMyCollection = (movie) => {
    // Create a new movie object to add to the user's collection
    const newMovie = {
      title: movie.title,
      year: movie.year,
      director: movie.director,
      genres: movie.genres || [],
      posterUrl: movie.posterUrl || '',
      notes: `Added from popular movies. Liked by ${movie.likeCount} other users.`
    };
    
    // Add the movie to the user's collection
    addMovie(user.id, newMovie);
    
    // Update the user's movie list in the Dashboard
    const updatedMovies = getUserMovies(user.id);
    setUserMovies(updatedMovies);
  };

  if (loading) {
    return <div className="loading-spinner">Loading popular movies...</div>;
  }

  if (popularMovies.length === 0) {
    return null; // Don't show section if there are no popular movies
  }

  return (
    <div className={`popular-movies-section ${theme}`}>
      <h2>Popular Movies From Other Users</h2>
      <p className="popular-description">These movies are favorites among other users. Add them to your collection!</p>
      
      <div className="popular-movies-grid">
        {popularMovies.map((movie, index) => (
          <div className={`popular-movie-card ${theme}`} key={index}>
            {movie.posterUrl ? (
              <div className="popular-movie-poster">
                <img src={movie.posterUrl} alt={`Poster for ${movie.title}`} />
              </div>
            ) : (
              <div className="popular-movie-poster placeholder-poster">
                <span>{movie.title[0]}</span>
              </div>
            )}
            
            <div className="popular-movie-info">
              <h3>{movie.title} {movie.year ? `(${movie.year})` : ''}</h3>
              <p>Directed by {movie.director}</p>
              <div className="popularity">
                <span className="like-count">❤️ {movie.likeCount} {movie.likeCount === 1 ? 'user' : 'users'}</span>
              </div>
              
              <button 
                className="btn btn-primary add-to-collection"
                onClick={() => addToMyCollection(movie)}
              >
                Add to My Collection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularMovies;
