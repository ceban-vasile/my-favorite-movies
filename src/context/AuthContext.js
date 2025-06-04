import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app load
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      setUser({ username: response.username });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Login failed. Please try again.'
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authService.register(username, email, password);
      setUser({ username: response.username });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data || 'Registration failed. Please try again.'
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
