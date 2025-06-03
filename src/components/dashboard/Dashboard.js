import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getUserMovies, searchMovies } from '../../services/movieService';
import MovieList from './MovieList';
import MovieForm from './MovieForm';
import SearchFilter from './SearchFilter';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  // Load movies on component mount
  useEffect(() => {
    if (user) {
      const userMovies = getUserMovies(user.id);
      setMovies(userMovies);
    }
  }, [user]);

  // Handle search and filter
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
  };

  // Get filtered movies
  const filteredMovies = searchMovies(user?.id, searchQuery, activeFilter);

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-header">
        <h1>My Movie Collection</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Movie'}
        </button>
      </div>

      {showForm && <MovieForm setMovies={setMovies} setShowForm={setShowForm} />}

      <SearchFilter 
        onSearch={handleSearch} 
        onFilter={handleFilter} 
        activeFilter={activeFilter} 
      />

      {filteredMovies.length > 0 ? (
        <MovieList movies={filteredMovies} setMovies={setMovies} />
      ) : (
        <div className="no-movies-message">
          <p>No movies found. Add some to your collection!</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
