import { api } from '../api';
import authHeader from './auth-header';

export const getPublicContent = () => {
    return api.get('all');
};

export const getUserBoard = () => {
    return api.get('user', { headers: authHeader() });
};

export const getModeratorBoard = () => {
    return api.get('mod', { headers: authHeader() });
};

export const getAdminBoard = () => {
    return api.get('admin', { headers: authHeader() });
};
