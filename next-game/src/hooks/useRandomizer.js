import { useState, useEffect, useCallback } from 'react';

const mockGames = [
  {
    id: '1',
    name: 'Fortnite',
    genre: 'Battle Royale',
    description: 'Free-to-play battle royale game with building mechanics',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'],
    modes: ['Multiplayer', 'Co-op', 'Online'],
    epicUrl: 'https://store.epicgames.com/en-US/p/fortnite',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'The Witcher 3: Wild Hunt',
    genre: 'RPG',
    description: 'Action role-playing game set in a fantasy world',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    modes: ['Singleplayer', 'Offline'],
    epicUrl: 'https://store.epicgames.com/en-US/p/the-witcher-3-wild-hunt',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Rocket League',
    genre: 'Sports',
    description: 'Soccer with rocket-powered cars',
    platforms: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch'],
    modes: ['Multiplayer', 'Co-op', 'Online'],
    epicUrl: 'https://store.epicgames.com/en-US/p/rocket-league',
    image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Among Us',
    genre: 'Party',
    description: 'Online multiplayer social deduction game',
    platforms: ['PC', 'Mobile', 'Nintendo Switch'],
    modes: ['Multiplayer', 'Online'],
    epicUrl: 'https://store.epicgames.com/en-US/p/among-us',
    image: 'https://images.unsplash.com/photo-1618331833071-1c0c6ee3d19e?w=800&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Cyberpunk 2077',
    genre: 'RPG',
    description: 'Open-world action-adventure RPG',
    platforms: ['PC', 'PlayStation', 'Xbox'],
    modes: ['Singleplayer', 'Offline'],
    epicUrl: 'https://store.epicgames.com/en-US/p/cyberpunk-2077',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&auto=format&fit=crop'
  }
];

export const useRandomizer = () => {
  const [randomGame, setRandomGame] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Завантажити улюблені ігри з localStorage
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('nextgame_favorites');
        if (savedFavorites) {
          const parsed = JSON.parse(savedFavorites);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        }
      } catch (err) {
        console.error('Error loading favorites:', err);
        localStorage.removeItem('nextgame_favorites');
      }
    };
    
    loadFavorites();
  }, []);

  // Зберегти улюблені ігри
  const saveFavoritesToStorage = (newFavorites) => {
    try {
      localStorage.setItem('nextgame_favorites', JSON.stringify(newFavorites));
    } catch (err) {
      console.error('Error saving favorites:', err);
    }
  };

  const getRandomGame = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredGames = [...mockGames];
      
      if (filters.genre && filters.genre !== 'all') {
        filteredGames = filteredGames.filter(game => 
          game.genre.toLowerCase().includes(filters.genre.toLowerCase())
        );
      }
      
      if (filters.platform && filters.platform !== 'all') {
        filteredGames = filteredGames.filter(game => 
          game.platforms.some(platform => 
            platform.toLowerCase().includes(filters.platform.toLowerCase())
          )
        );
      }
      
      if (filters.mode && filters.mode !== 'all') {
        filteredGames = filteredGames.filter(game => 
          game.modes.some(mode => 
            mode.toLowerCase().includes(filters.mode.toLowerCase())
          )
        );
      }
      
      if (filteredGames.length === 0) {
        throw new Error('No games match your filters. Try changing them!');
      }
      
      const randomIndex = Math.floor(Math.random() * filteredGames.length);
      const selectedGame = filteredGames[randomIndex];
      
      setRandomGame(selectedGame);
      return selectedGame;
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Додати гру до улюблених
  const addToFavorites = useCallback((game) => {
    if (!game) return false;
    
    const isAlreadyFavorite = favorites.some(fav => fav.id === game.id);
    
    if (!isAlreadyFavorite) {
      const newFavorites = [...favorites, game];
      setFavorites(newFavorites);
      saveFavoritesToStorage(newFavorites);
      return true;
    }
    return false;
  }, [favorites]);

  // Видалити гру з улюблених
  const removeFromFavorites = useCallback((gameId) => {
    const newFavorites = favorites.filter(game => game.id !== gameId);
    setFavorites(newFavorites);
    saveFavoritesToStorage(newFavorites);
  }, [favorites]);

  // Перевірити чи гра в улюблених
  const isFavorite = useCallback((gameId) => {
    return favorites.some(game => game.id === gameId);
  }, [favorites]);

  // Очистити всі улюблені ігри
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    localStorage.removeItem('nextgame_favorites');
  }, []);

  const clearRandomGame = () => {
    setRandomGame(null);
    setError(null);
  };

  return {
    randomGame,
    isLoading,
    error,
    favorites,
    getRandomGame,
    clearRandomGame,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
    getFavorites: () => favorites
  };
};