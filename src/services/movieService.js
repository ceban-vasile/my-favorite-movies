// Movies will be stored in localStorage
const MOVIES_KEY = 'user_movies';

// Get all movies for a specific user
export const getUserMovies = (userId) => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  return allMovies[userId] || [];
};

// Add a new movie for a user
export const addMovie = (userId, movie) => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  
  // Get user's movies or initialize empty array
  const userMovies = allMovies[userId] || [];
  
  // Add new movie with generated ID
  const newMovie = {
    id: Date.now().toString(),
    ...movie,
    addedAt: new Date().toISOString(),
    favorite: false
  };
  
  // Update user's movies
  allMovies[userId] = [...userMovies, newMovie];
  
  // Save back to localStorage
  localStorage.setItem(MOVIES_KEY, JSON.stringify(allMovies));
  
  return newMovie;
};

// Toggle favorite status for a movie
export const toggleFavorite = (userId, movieId) => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  const userMovies = allMovies[userId] || [];
  
  const updatedMovies = userMovies.map(movie => {
    if (movie.id === movieId) {
      return { ...movie, favorite: !movie.favorite };
    }
    return movie;
  });
  
  // Update storage
  allMovies[userId] = updatedMovies;
  localStorage.setItem(MOVIES_KEY, JSON.stringify(allMovies));
  
  return updatedMovies;
};

// Delete a movie
export const deleteMovie = (userId, movieId) => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  const userMovies = allMovies[userId] || [];
  
  const updatedMovies = userMovies.filter(movie => movie.id !== movieId);
  
  // Update storage
  allMovies[userId] = updatedMovies;
  localStorage.setItem(MOVIES_KEY, JSON.stringify(allMovies));
  
  return updatedMovies;
};

// Search and filter movies
export const searchMovies = (userId, query, filter) => {
  const userMovies = getUserMovies(userId);
  
  return userMovies.filter(movie => {
    // Apply text search
    const matchesQuery = query ? 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase()) :
      true;
    
    // Apply filters
    let matchesFilter = true;
    if (filter === 'favorites') {
      matchesFilter = movie.favorite;
    }
    
    return matchesQuery && matchesFilter;
  });
};
