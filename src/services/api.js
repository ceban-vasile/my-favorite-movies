// Create a service using fetch instead of axios to handle API calls

const API_URL = 'http://localhost:8080/api';

// Helper function to handle API requests
const apiRequest = async (url, options = {}) => {
  // Add Authorization header if token exists
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_URL}${url}`, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    
    // Check if the response has content
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {};
    
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth services
export const authService = {
  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username
      }));
    }
    
    return data;
  },
  
  register: async (username, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        username: data.username
      }));
    }
    
    return data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Movie services
export const movieService = {
  getUserMovies: async () => {
    return apiRequest('/movies', { method: 'GET' });
  },
  
  addMovie: async (movieData) => {
    return apiRequest('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData)
    });
  },
  
  deleteMovie: async (id) => {
    await apiRequest(`/movies/${id}`, { method: 'DELETE' });
    return id;
  },
};

export default { authService, movieService };
