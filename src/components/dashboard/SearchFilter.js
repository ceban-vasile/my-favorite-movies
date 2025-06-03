import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Dashboard.css';

const SearchFilter = ({ onSearch, onFilter, activeFilter }) => {
  const { theme } = useTheme();
  
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className={`search-filter-container ${theme}`}>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by title or director..."
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search movies"
        />
      </div>
      
      <div className="filter-options">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => onFilter('all')}
        >
          All Movies
        </button>
        <button
          className={`filter-btn ${activeFilter === 'favorites' ? 'active' : ''}`}
          onClick={() => onFilter('favorites')}
        >
          Favorites
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
