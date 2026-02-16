
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


export const STORAGE_KEYS = {
    TOKEN: 'nextgame_token',
    USER: 'nextgame_user'
};

export const getToken = () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setToken = (token) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const removeToken = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
};


export const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Щось пішло не так');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const apiRequestWithAuth = async (endpoint, options = {}) => {
    const token = getToken();

    if (!token) {
        throw new Error('Необхідна авторизація');
    }

    return apiRequest(endpoint, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    });
};