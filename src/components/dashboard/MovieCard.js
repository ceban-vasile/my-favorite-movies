import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const MovieCard = ({ movie, onDelete, onToggleFavorite }) => {
  const { theme } = useTheme();

  // Format the release year
  const formattedYear = movie.year ? `(${movie.year})` : '';
  
  // Limit notes length and add ellipsis if too long
  const displayNotes = movie.notes && movie.notes.length > 100 
    ? `${movie.notes.substring(0, 100)}...` 
    : movie.notes;

  return (
    <div className={`movie-card ${theme}`}>
      {movie.posterUrl ? (
        <div className="movie-poster">
          <img src={movie.posterUrl} alt={`Poster for ${movie.title}`} />
        </div>
      ) : (
        <div className="movie-poster placeholder-poster">
          <span>{movie.title[0]}</span>
        </div>
      )}
      
      <div className="movie-info">
        <h3 className="movie-title">
          {movie.title} <span className="movie-year">{formattedYear}</span>
        </h3>
        
        <p className="movie-director">Directed by {movie.director}</p>
        
        {movie.genres && movie.genres.length > 0 && (
          <div className="movie-genres">
            {movie.genres.map((genre, index) => (
              <span key={index} className="genre-tag">{genre}</span>
            ))}
          </div>
        )}
        
        {displayNotes && <p className="movie-notes">"{displayNotes}"</p>}
      </div>
      
      <div className="movie-actions">
        <button 
          className={`btn-favorite ${movie.favorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(movie.id)}
          aria-label={movie.favorite ? "Remove from favorites" : "Add to favorites"}
          title={movie.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          {movie.favorite ? '★' : '☆'}
        </button>
        <button 
          className="btn-delete"
          onClick={() => onDelete(movie.id)}
          aria-label="Delete movie"
          title="Delete movie"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
