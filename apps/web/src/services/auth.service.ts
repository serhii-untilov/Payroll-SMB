import { ITokens } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export const register = async (name: string, email: string, password: string): Promise<ITokens> => {
    const response = await api.post('auth/register', {
        name,
        email,
        password,
        roles: [],
    });
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        localStorage.setItem('user', JSON.stringify(tokens));
    }
    return tokens;
};

export const login = async (name: string, password: string): Promise<ITokens> => {
    const response = await api.post('auth/login', { name, password });
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        localStorage.setItem('user', JSON.stringify(tokens));
    }
    return tokens;
};

export const logout = (): Promise<null> => {
    localStorage.removeItem('user');
    return api.post('auth/logout', { headers: authHeader() });
};

export const getCurrentUser = (): ITokens | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};
