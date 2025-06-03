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

// Helper function to normalize movie titles and directors for comparison
const normalizeMovieData = (title, director) => {
  // Remove special characters, extra spaces, and convert to lowercase
  const normalizeString = (str) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s]/g, '')  // Remove special characters
      .replace(/\s+/g, ' ')     // Replace multiple spaces with a single space
      .trim();                 // Remove leading/trailing spaces
  };
  
  return {
    normalizedTitle: normalizeString(title),
    normalizedDirector: normalizeString(director)
  };
};

// Get popular movies (updated with better comparison)
export const getPopularMovies = (currentUserId) => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  const movieRankings = [];
  
  // Collect all movies from all users
  Object.entries(allMovies).forEach(([userId, movies]) => {
    if (userId !== currentUserId) { // Exclude current user's movies
      movies.forEach(movie => {
        if (movie.favorite) { // Only consider favorited movies
          const { normalizedTitle, normalizedDirector } = normalizeMovieData(
            movie.title, 
            movie.director
          );
          
          const existingMovie = movieRankings.find(m => {
            const { normalizedTitle: existingTitle, normalizedDirector: existingDirector } = 
              normalizeMovieData(m.title, m.director);
            
            return normalizedTitle === existingTitle && 
                   normalizedDirector === existingDirector;
          });
          
          if (existingMovie) {
            if (!existingMovie.likedBy.includes(userId)) {
              existingMovie.likeCount += 1;
              existingMovie.likedBy.push(userId);
            }
          } else {
            movieRankings.push({
              ...movie,
              likeCount: 1,
              likedBy: [userId]
            });
          }
        }
      });
    }
  });
  
  // Sort by popularity (like count)
  return movieRankings
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 5); // Return top 5 movies
};

// Get all movies from all users for exploration
export const getAllMovies = () => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  const moviesList = [];
  
  // Collect all movies from all users with userInfo
  Object.entries(allMovies).forEach(([userId, movies]) => {
    movies.forEach(movie => {
      // Get user info to display who added the movie
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const userInfo = users.find(u => u.id === userId);
      const userName = userInfo ? userInfo.name : 'Unknown User';
      
      moviesList.push({
        ...movie,
        addedBy: userName,
        userId,
        uniqueId: `${userId}-${movie.id}` // Create a unique identifier
      });
    });
  });
  
  // Sort by most recently added
  return moviesList.sort((a, b) => 
    new Date(b.addedAt) - new Date(a.addedAt)
  );
};

// Get most popular movies across all users
export const getMostPopularMovies = () => {
  const allMovies = JSON.parse(localStorage.getItem(MOVIES_KEY)) || {};
  const movieStats = {};
  
  // Count movie occurrences and favorites
  Object.values(allMovies).forEach(movies => {
    movies.forEach(movie => {
      // Create a key based on title and director
      const { normalizedTitle, normalizedDirector } = normalizeMovieData(
        movie.title, 
        movie.director
      );
      const key = `${normalizedTitle}|${normalizedDirector}`;
      
      if (!movieStats[key]) {
        movieStats[key] = {
          movie,
          occurrences: 0,
          favoriteCount: 0,
          users: new Set()
        };
      }
      
      movieStats[key].occurrences++;
      movieStats[key].users.add(movie.id);
      if (movie.favorite) {
        movieStats[key].favoriteCount++;
      }
    });
  });
  
  // Convert to array and sort by popularity metrics
  return Object.values(movieStats)
    .map(stat => ({
      ...stat.movie,
      occurrences: stat.occurrences,
      favoriteCount: stat.favoriteCount,
      popularity: (stat.favoriteCount * 2) + stat.occurrences,
      userCount: stat.users.size
    }))
    .sort((a, b) => b.popularity - a.popularity);
};
