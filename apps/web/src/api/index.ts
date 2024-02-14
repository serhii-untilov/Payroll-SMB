import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
    // timeout: 1000,
    headers: {
        'Content-type': 'application/json',
    },
});
