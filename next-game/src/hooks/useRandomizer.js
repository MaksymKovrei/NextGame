import { useState, useEffect, useCallback } from 'react';
import { gamesAPI } from '../api/games.js';

export const useRandomizer = (user) => {
    const [randomGame, setRandomGame] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    useEffect(() => {
        const loadFavorites = async () => {
            if (!user) {
                setFavorites([]);
                return;
            }

            try {
                setLoadingFavorites(true);
                const data = await gamesAPI.getFavorites(user.id);

                if (Array.isArray(data.favorites)) {
                    setFavorites(data.favorites);
                } else {
                    setFavorites([]);
                }
            } catch (err) {
                console.error('Error loading favorites:', err);
                setFavorites([]);
            } finally {
                setLoadingFavorites(false);
            }
        };

        loadFavorites();
    }, [user]);

    const getRandomGame = async (filters = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            const selectedGame = await gamesAPI.getRandom(filters);
            setRandomGame(selectedGame);
            return selectedGame;

        } catch (err) {
            console.error('Error getting random game:', err);
            setError(err.message || 'Помилка отримання гри');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const addToFavorites = useCallback(async (game) => {
        if (!game) return false;
        if (!user) {
            throw new Error('Потрібно увійти в систему');
        }

        const isAlreadyFavorite = favorites.some(fav => fav.id === game.id);
        if (isAlreadyFavorite) {
            return false;
        }

        try {
            await gamesAPI.like(game.id);

            const newFavorites = [...favorites, game];
            setFavorites(newFavorites);

            return true;
        } catch (err) {
            console.error('Error adding to favorites:', err);

            if (err.message === 'Гра вже в уподобаних') {
                const data = await gamesAPI.getFavorites(user.id);
                setFavorites(data.favorites || []);
                return false;
            }

            throw err;
        }
    }, [favorites, user]);

    const removeFromFavorites = useCallback(async (gameId) => {
        if (!user) {
            throw new Error('Потрібно увійти в систему');
        }

        try {
            await gamesAPI.unlike(gameId);

            const newFavorites = favorites.filter(game => game.id !== gameId);
            setFavorites(newFavorites);

            return true;
        } catch (err) {
            console.error('Error removing from favorites:', err);
            throw err;
        }
    }, [favorites, user]);

    const isFavorite = useCallback((gameId) => {
        return favorites.some(game => game.id === gameId);
    }, [favorites]);

    const clearFavorites = useCallback(async () => {
        if (!user) {
            throw new Error('Потрібно увійти в систему');
        }

        try {
            const deletePromises = favorites.map(game => gamesAPI.unlike(game.id));
            await Promise.all(deletePromises);

            setFavorites([]);

            return true;
        } catch (err) {
            console.error('Error clearing favorites:', err);

            try {
                const data = await gamesAPI.getFavorites(user.id);
                setFavorites(data.favorites || []);
            } catch (reloadErr) {
                console.error('Error reloading favorites:', reloadErr);
            }

            throw err;
        }
    }, [favorites, user]);

    const clearRandomGame = () => {
        setRandomGame(null);
        setError(null);
    };

    const reloadFavorites = useCallback(async () => {
        if (!user) {
            setFavorites([]);
            return;
        }

        try {
            setLoadingFavorites(true);
            const data = await gamesAPI.getFavorites(user.id);
            setFavorites(data.favorites || []);
        } catch (err) {
            console.error('Error reloading favorites:', err);
        } finally {
            setLoadingFavorites(false);
        }
    }, [user]);

    return {
        randomGame,
        isLoading,
        error,
        favorites,
        loadingFavorites,
        getRandomGame,
        clearRandomGame,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        clearFavorites,
        reloadFavorites,
        getFavorites: () => favorites
    };
};