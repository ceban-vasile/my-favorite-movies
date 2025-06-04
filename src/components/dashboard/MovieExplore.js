import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { movieService } from '../../services/api';
import MovieCard from './MovieCard';
import './MovieExplore.css';

const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // example TMDB API key, use your own
const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
const SEARCH_URL = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

function MovieExplore() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userMovies, setUserMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(API_URL);
        setMovies(response.data.results);
        
        // Get user's favorite movies to check against
        const userMoviesData = await movieService.getUserMovies();
        setUserMovies(userMoviesData);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm) {
      setLoading(true);
      try {
        const response = await axios.get(`${SEARCH_URL}${searchTerm}`);
        setMovies(response.data.results);
      } catch (err) {
        setError('Failed to search movies. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleAddFavorite = async (movie) => {
    try {
      const movieData = {
        title: movie.title,
        genre: movie.genre_ids?.join(',') || '',
        year: new Date(movie.release_date).getFullYear() || 0,
        posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        description: movie.overview
      };
      
      const savedMovie = await movieService.addMovie(movieData);
      setUserMovies([...userMovies, savedMovie]);
      
    } catch (error) {
      setError('Failed to add movie to favorites. Please try again.');
    }
  };

  const isMovieInFavorites = (movieId) => {
    return userMovies.some(m => m.title === movies.find(movie => movie.id === movieId)?.title);
  };

  if (loading) {
    return <div className="explore-loading">Loading...</div>;
  }

  return (
    <div className="explore">
      <h1>Explore Movies</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={{
              ...movie,
              posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            }}
            onAdd={() => handleAddFavorite(movie)}
            isFavorite={isMovieInFavorites(movie.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default MovieExplore;
