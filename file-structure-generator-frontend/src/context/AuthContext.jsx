import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api from '../service/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      
      if (token && username) {
        try {
          // Verify token is still valid
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Optional: Verify token with server
          // const response = await axios.get('/api/auth/verify');
          // if (response.data.valid) {
            setUser({ username, token });
          // }
        } catch (error) {
          console.error('Token verification failed:', error);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('username');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password
      });

      const { token, username: returnedUsername } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);
      
      // Set user state
      setUser({ username: returnedUsername, token });
      
      // Optional: api instance reads token from localStorage via interceptor
      // If you also use raw axios elsewhere, you may keep this line:
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = 'Invalid username or password.';
        } else if (error.response.status === 429) {
          errorMessage = 'Too many login attempts. Please try again later.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password
      });

      const { token, username: returnedUsername } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('username', returnedUsername);
      
      // Set user state
      setUser({ username: returnedUsername, token });
      
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      
      // Handle different error types
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Username or email already exists.';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data?.message || 'Invalid input. Please check your information.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      }
      
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Clear user state
    setUser(null);
    
    // Remove axios header
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 