import { apiRequest } from './config';

// Auth API methods
export const authAPI = {
    register: async (username, email, password) => {
        const data = await apiRequest('/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        return data;
    },

    login: async (email, password) => {
        const data = await apiRequest('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        return data;
    },

    verifyToken: async () => {
        try {
            return true;
        } catch (error) {
            return false;
        }
    }
};