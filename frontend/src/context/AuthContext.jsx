import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile } from '../api/auth.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('careertech_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('careertech_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getProfile();
          setUser(data.user);
          localStorage.setItem('careertech_user', JSON.stringify(data.user));
        } catch (err) {
          console.error('[AuthContext] Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('careertech_token', data.token);
    localStorage.setItem('careertech_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem('careertech_token', data.token);
    localStorage.setItem('careertech_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('careertech_token');
    localStorage.removeItem('careertech_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
      localStorage.setItem('careertech_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      console.error('[AuthContext] Failed to refresh profile:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
