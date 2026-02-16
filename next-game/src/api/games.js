import { apiRequest, apiRequestWithAuth } from './config';

// Games API methods
export const gamesAPI = {
    // Отримати всі ігри
    getAll: async () => {
        const data = await apiRequest('/games');
        return data;
    },

    // Отримати випадкову гру
    getRandom: async (filters = {}) => {
        const params = new URLSearchParams();

        if (filters.genre && filters.genre !== 'all') {
            params.append('genre', filters.genre);
        }
        if (filters.platform && filters.platform !== 'all') {
            params.append('platform', filters.platform);
        }
        if (filters.mode && filters.mode !== 'all') {
            params.append('mode', filters.mode);
        }

        const queryString = params.toString();
        const endpoint = `/random${queryString ? `?${queryString}` : ''}`;

        const data = await apiRequest(endpoint);
        return data;
    },

    // Додати гру (потрібна авторизація)
    add: async (gameData) => {
        const data = await apiRequestWithAuth('/games', {
            method: 'POST',
            body: JSON.stringify(gameData)
        });
        return data;
    },

    // Уподобати гру (потрібна авторизація)
    like: async (gameId) => {
        const data = await apiRequestWithAuth(`/games/${gameId}/like`, {
            method: 'POST'
        });
        return data;
    },

    // Видалити з уподобань (потрібна авторизація)
    unlike: async (gameId) => {
        const data = await apiRequestWithAuth(`/games/${gameId}/like`, {
            method: 'DELETE'
        });
        return data;
    },

    // Отримати уподобані ігри користувача (потрібна авторизація)
    getFavorites: async (userId) => {
        const data = await apiRequestWithAuth(`/users/${userId}/favorites`);
        return data;
    }
};