import React, { createContext, useContext, useState, useEffect } from 'react';
import authApi from '../api/auth';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('to_token') || null);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('to_current_user');
    if (saved && saved !== 'undefined') {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const mapRole = (backendRole) => {
    if (!backendRole) return backendRole;
    if (backendRole === 'ROLE_FLEET_MANAGER') return 'Fleet Manager';
    if (backendRole === 'ROLE_DRIVER') return 'Dispatcher';
    if (backendRole === 'ROLE_SAFETY_OFFICER') return 'Safety Officer';
    if (backendRole === 'ROLE_FINANCIAL_ANALYST') return 'Financial Analyst';
    return backendRole;
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      
      const loggedInUser = {
        name: data.name,
        email: data.email,
        role: mapRole(data.role)
      };

      // Save to state and storage
      setToken(data.token);
      setCurrentUser(loggedInUser);
      localStorage.setItem('to_token', data.token);
      localStorage.setItem('to_current_user', JSON.stringify(loggedInUser));

      toast.success(`Welcome back, ${loggedInUser.name}!`);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role) => {
    setLoading(true);
    try {
      const data = await authApi.register(name, email, password, role);
      
      const registeredUser = {
        name: data.name,
        email: data.email,
        role: mapRole(data.role)
      };
      
      setToken(data.token);
      setCurrentUser(registeredUser);
      localStorage.setItem('to_token', data.token);
      localStorage.setItem('to_current_user', JSON.stringify(registeredUser));
      
      toast.success(`Account created successfully! Welcome, ${registeredUser.name}`);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('to_token');
    localStorage.removeItem('to_current_user');
    toast.success('Successfully logged out.');
  };

  // Listen for auto-logout events from Axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      setToken(null);
      setCurrentUser(null);
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, currentUser, loading, login, register, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
