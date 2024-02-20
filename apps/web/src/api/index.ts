import axios from 'axios';
import { redirect } from 'react-router-dom';
import { getUserRefreshToken, removeUserTokens, saveUserTokens } from '../services/token.service';
import authHeader from '../services/auth-header';

console.log('import.meta.env.VITE_APP_URL:', import.meta.env.VITE_APP_URL);

export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
    // timeout: 1000,
    headers: {
        'Content-type': 'application/json',
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getUserRefreshToken();
                const response = await axios.post('/api/auth/refresh', { refreshToken });
                const tokens = response.data;
                saveUserTokens(tokens);
                // Retry the original request with the new token
                originalRequest.headers.Authorization = authHeader().Authorization;
                return axios(originalRequest);
            } catch (error) {
                // Handle refresh token error or redirect to login
                removeUserTokens();
                delete originalRequest.headers.Authorization;
                return redirect('/login');
            }
        }

        return Promise.reject(error);
    },
);
