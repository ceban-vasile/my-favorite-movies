import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { addMovie, getUserMovies } from '../../services/movieService';
import './Dashboard.css';

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller'
];

const MovieForm = ({ setMovies, setShowForm }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    director: '',
    genres: [],
    posterUrl: '',
    notes: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const toggleGenre = (genre) => {
    setFormData(prevData => {
      if (prevData.genres.includes(genre)) {
        return {
          ...prevData,
          genres: prevData.genres.filter(g => g !== genre)
        };
      } else {
        return {
          ...prevData,
          genres: [...prevData.genres, genre]
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.title) {
      setError('Title is required');
      return;
    }
    
    if (!formData.director) {
      setError('Director name is required');
      return;
    }

    // Add movie
    addMovie(user.id, formData);
    
    // Refresh movie list
    const updatedMovies = getUserMovies(user.id);
    setMovies(updatedMovies);
    
    // Reset form and hide it
    setShowForm(false);
  };

  return (
    <div className={`movie-form-container ${theme}`}>
      <h2>Add New Movie</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Movie Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter movie title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="year">Release Year</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="form-control"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="director">Director *</label>
          <input
            type="text"
            id="director"
            name="director"
            value={formData.director}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter director's name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="posterUrl">Poster URL</label>
          <input
            type="url"
            id="posterUrl"
            name="posterUrl"
            value={formData.posterUrl}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter poster image URL"
          />
        </div>
        
        <div className="form-group">
          <label>Genres</label>
          <div className="genres-container">
            {GENRES.map(genre => (
              <button
                type="button"
                key={genre}
                className={`genre-button ${formData.genres.includes(genre) ? 'selected' : ''}`}
                onClick={() => toggleGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-control"
            placeholder="Add your personal notes about the movie"
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Add Movie
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieForm;
