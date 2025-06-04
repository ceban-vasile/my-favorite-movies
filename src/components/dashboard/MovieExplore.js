import React, { useState, useEffect } from 'react';
// Import the movieService without relying on axios directly in this file
import { movieService } from '../../services/api';
import MovieCard from './MovieCard';
import './MovieExplore.css';

// TMDB API configuration
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // example key, replace with your own
const BASE_URL = 'https://api.themoviedb.org/3';
const DISCOVER_URL = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc`;
const SEARCH_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieExplore() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userMovies, setUserMovies] = useState([]);

  // Function to fetch data from TMDB API
  const fetchFromTMDB = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching from TMDB:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Use fetch instead of axios
        const data = await fetchFromTMDB(DISCOVER_URL);
        setMovies(data.results);
        
        // Get user's favorite movies to check against
        try {
          const userMoviesData = await movieService.getUserMovies();
          setUserMovies(userMoviesData);
        } catch (userMoviesError) {
          console.error("Error fetching user movies:", userMoviesError);
          // Don't set an error if only user movies fail to load
        }
        
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
        // Use fetch instead of axios
        const data = await fetchFromTMDB(`${SEARCH_URL}${encodeURIComponent(searchTerm)}`);
        setMovies(data.results);
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
        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
        posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : '',
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
              posterUrl: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : ''
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
