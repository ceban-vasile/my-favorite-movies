import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => 
      u.email === userData.email && u.password === userData.password
    );
    
    if (foundUser) {
      const authenticatedUser = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email
      };
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      return true;
    }
    return false;
  };

  const signup = (userData) => {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.some(u => u.email === userData.email)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
    };
    
    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in the user
    const authenticatedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
    setUser(authenticatedUser);
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
