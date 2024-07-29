import { authHeader } from '@/services/auth/auth-header';
import {
    getUserAccessToken,
    getUserRefreshToken,
    removeUserTokens,
    saveUserTokens,
} from '@/services/auth/token.service';
import { DefaultApi as PayrollApi } from '@repo/openapi';
import { deepStringToDate } from '@repo/shared';
import axios from 'axios';
import { redirect } from 'react-router-dom';

export type ApiError = {
    error?: string;
    message: string;
    statusCode?: string;
};

const baseURL = import.meta.env.VITE_APP_URL;

console.log('baseURL:', baseURL);

export const axiosInstance = axios.create({
    baseURL,
    // timeout: 1000,
    headers: {
        'Content-type': 'application/json',
    },
});

export type * as dto from '@repo/openapi';
export const api = new PayrollApi(undefined, baseURL, axiosInstance);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getUserRefreshToken();
                const response = await axios.get('/api/auth/refresh', {
                    headers: authHeader(refreshToken),
                });
                const tokens = response.data;
                saveUserTokens(tokens);
                // Retry the original request with the new token
                originalRequest.headers.Authorization = authHeader().Authorization;
                return axios(originalRequest);
            } catch (_error) {
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

// Casting dates properly from an API response in typescript
// https://stackoverflow.com/questions/65692061/casting-dates-properly-from-an-api-response-in-typescript
axiosInstance.interceptors.response.use((originalResponse) => {
    deepStringToDate(originalResponse.data);
    return originalResponse;
});

axiosInstance.interceptors.request.use((originalRequest) => {
    const headerToken = getUserAccessToken();
    if (headerToken) {
        originalRequest.headers['Authorization'] = `Bearer ${headerToken}`;
    }
    return originalRequest;
});
