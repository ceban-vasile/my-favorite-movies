import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Creating axios instance with updated CORS configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Change this to false if you're having CORS issues with credentials
  withCredentials: false 
});

// Add authentication token to requests if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// For Fetch API implementation
const API_URL = 'http://localhost:8081/api';

// Helper function to handle API requests with improved error handling
const apiRequest = async (url, options = {}) => {
  // Add Authorization header if token exists
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    // Try without including credentials for non-authenticated requests
    credentials: token ? 'include' : 'same-origin'
  };

  try {
    console.log(`Making request to: ${API_URL}${url}`, config);
    const response = await fetch(`${API_URL}${url}`, config);
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server error response:', errorData);
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
  register: async (username, email, password) => {
    console.log('Registering user:', { username, email });
    
    // Try using axios directly for registration as an alternative approach
    try {
      // First attempt with fetch
      try {
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
      } catch (fetchError) {
        console.log('Fetch registration failed, trying axios as fallback');
        
        // Fallback to axios if fetch fails
        const response = await axios.post(`${API_BASE_URL}/auth/register`, 
          { username, email, password },
          { 
            headers: { 'Content-Type': 'application/json' },
            withCredentials: false
          }
        );
        
        const data = response.data;
        
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify({
            username: data.username
          }));
        }
        
        return data;
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      throw error;
    }
  },
  
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

// Export axios instance for components that prefer using axios
export const api = axiosInstance;

// Export a combined object of all services
export const services = {
  auth: authService,
  movies: movieService
};

// Export a single default - choose either axios instance or services
export default api;
