import axios from 'axios';

console.log('import.meta.env.VITE_APP_URL:', import.meta.env.VITE_APP_URL);
export const api = axios.create({
    baseURL: import.meta.env.VITE_APP_URL,
    // timeout: 1000,
    headers: {
        'Content-type': 'application/json',
    },
});
