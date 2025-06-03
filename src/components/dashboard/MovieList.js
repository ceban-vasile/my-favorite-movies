import React from 'react';
import MovieCard from './MovieCard';
import { useAuth } from '../../context/AuthContext';
import { deleteMovie, toggleFavorite } from '../../services/movieService';
import './Dashboard.css';

const MovieList = ({ movies, setMovies }) => {
  const { user } = useAuth();

  const handleDelete = (movieId) => {
    const updatedMovies = deleteMovie(user.id, movieId);
    setMovies(updatedMovies);
  };

  const handleToggleFavorite = (movieId) => {
    const updatedMovies = toggleFavorite(user.id, movieId);
    setMovies(updatedMovies);
  };

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard 
          key={movie.id} 
          movie={movie} 
          onDelete={handleDelete} 
          onToggleFavorite={handleToggleFavorite} 
        />
      ))}
    </div>
  );
};

export default MovieList;
