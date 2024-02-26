import axios from 'axios';
import { redirect } from 'react-router-dom';
import { getUserRefreshToken, removeUserTokens, saveUserTokens } from '../services/token.service';
import authHeader from '../services/auth-header';

export type ApiError = {
    error?: string;
    message: string;
    statusCode?: string;
};

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
                const response = await axios.post('/api/auth/refresh', {
                    headers: authHeader(refreshToken),
                });
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

        // return Promise.reject(error.data);
        // console.log(error.config);
        // throw error.response?.data;
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.headers);
            // console.error('Error response:', error.response.status, error.response.data);
            console.error('Error response:', error);
            // throw new Error(
            //     `Error response: ${error.response.status}. ${JSON.stringify(error.response.data)}`,
            // );
            return Promise.reject(getApiError(error.response.data));
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.error('Error request:', error.request);
            // throw new Error(`Error request: ${JSON.stringify(error.request)}`);
            return Promise.reject(getApiError({ message: 'No response' }));
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error:', error);
            // throw new Error(`Error: ${error.message}`);
            return Promise.reject({ message: 'Bad request' });
        }
    },
);

function getApiError(apiError: ApiError): ApiError {
    return {
        error: apiError.error || '',
        message: apiError.message || '',
        statusCode: apiError.statusCode || '',
    };
}
