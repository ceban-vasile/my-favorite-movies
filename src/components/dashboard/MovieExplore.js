import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getAllMovies, getMostPopularMovies, addMovie, getUserMovies } from '../../services/movieService';
import './Dashboard.css';

const MovieExplore = ({ setUserMovies }) => {
  const [allMovies, setAllMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const recent = getAllMovies();
        const popular = getMostPopularMovies();
        
        setAllMovies(recent);
        setPopularMovies(popular);
        setLoading(false);
      };
      
      fetchData();
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
      notes: `Added from movie exploration.`
    };
    
    // Add the movie to the user's collection
    addMovie(user.id, newMovie);
    
    // Update the user's movie list
    const updatedMovies = getUserMovies(user.id);
    setUserMovies(updatedMovies);
    
    // Show feedback (could use a toast notification library in a real app)
    alert("Movie added to your collection!");
  };

  // Filter movies based on search term
  const filteredMovies = activeTab === 'recent' 
    ? allMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : popularMovies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      );

  if (loading) {
    return <div className="loading-container">Loading movie database...</div>;
  }

  return (
    <div className={`movie-explore ${theme}`}>
      <div className="explore-header">
        <div className="explore-nav">
          <Link to="/" className="back-to-dashboard">
            ← Back to My Movies
          </Link>
          <h1>Explore All Movies</h1>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search movies by title or director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="explore-tabs">
        <button 
          className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent Additions
        </button>
        <button 
          className={`tab-button ${activeTab === 'popular' ? 'active' : ''}`}
          onClick={() => setActiveTab('popular')}
        >
          Most Popular
        </button>
      </div>
      
      {filteredMovies.length > 0 ? (
        <div className="explore-grid">
          {filteredMovies.map((movie, index) => (
            <div className={`explore-movie-card ${theme}`} key={movie.uniqueId || index}>
              {movie.posterUrl ? (
                <div className="explore-movie-poster">
                  <img src={movie.posterUrl} alt={`Poster for ${movie.title}`} />
                </div>
              ) : (
                <div className="explore-movie-poster placeholder-poster">
                  <span>{movie.title[0]}</span>
                </div>
              )}
              
              <div className="explore-movie-info">
                <h3>{movie.title} {movie.year ? `(${movie.year})` : ''}</h3>
                <p className="director">Directed by {movie.director}</p>
                
                {activeTab === 'recent' && movie.addedBy && (
                  <p className="added-by">Added by: {movie.addedBy}</p>
                )}
                
                {activeTab === 'popular' && (
                  <div className="popularity-metrics">
                    <span className="metric">
                      <i className="icon-users">👥</i> {movie.userCount || 0} users
                    </span>
                    <span className="metric">
                      <i className="icon-favorites">⭐</i> {movie.favoriteCount || 0} favorites
                    </span>
                  </div>
                )}
                
                {movie.genres && movie.genres.length > 0 && (
                  <div className="explore-movie-genres">
                    {movie.genres.map((genre, idx) => (
                      <span key={idx} className="genre-tag">{genre}</span>
                    ))}
                  </div>
                )}
                
                {movie.userId !== user.id && (
                  <button 
                    className="btn btn-primary add-to-collection"
                    onClick={() => addToMyCollection(movie)}
                  >
                    Add to My Collection
                  </button>
                )}
              </div>
              
              {activeTab === 'popular' && (
                <div className="popularity-badge" title="Popularity score">
                  {movie.popularity}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-movies-message">
          {searchTerm ? 'No movies match your search.' : 'No movies available.'}
        </div>
      )}
    </div>
  );
};

export default MovieExplore;
