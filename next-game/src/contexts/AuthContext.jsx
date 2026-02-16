import React, { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/auth';
import { STORAGE_KEYS, setToken, removeToken, getToken } from '../api/config';
import { createContext } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      const token = getToken();

      if (savedUser && token) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Помилка парсингу юзера:', error);
          localStorage.removeItem(STORAGE_KEYS.USER);
          removeToken();
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);

      setToken(response.token);
      setUser(response.user);

      return response.user;
    } catch (error) {
      console.error('Помилка логіну:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.register(
        userData.username,
        userData.email,
        userData.password
      );

      setToken(response.token);
      setUser(response.user);

      return response.user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
