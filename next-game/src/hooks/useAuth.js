import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Завантаження користувача з localStorage при завантаженні
  useEffect(() => {
    const savedUser = localStorage.getItem('nextgame_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('nextgame_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Збереження користувача в localStorage при зміні
  useEffect(() => {
    if (user) {
      localStorage.setItem('nextgame_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nextgame_user');
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // Імітація API запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перевірка демо користувача
      const demoUsers = [
        { id: '1', username: 'DemoUser', email: 'demo@gmail.com', password: 'demo123', role: 'user' },
        { id: '2', username: 'Admin', email: 'admin@gmail.com', password: 'admin123', role: 'admin' }
      ];
      
      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Видаляємо пароль з об'єкта користувача
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      
      return userWithoutPassword;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      // Імітація API запиту
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Перевірка чи email вже використовується
      const savedUser = localStorage.getItem('nextgame_user');
      if (savedUser) {
        const existingUser = JSON.parse(savedUser);
        if (existingUser.email === userData.email) {
          throw new Error('Email already in use');
        }
      }
      
      // Створення нового користувача
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };
};