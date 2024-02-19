import { IAuth, ICreateUser, ITokens, IUser } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export const registerUser = async (params: ICreateUser): Promise<ITokens> => {
    const response = await api.post('/api/auth/register', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        localStorage.setItem('user', JSON.stringify(tokens));
    }
    return tokens;
};

export const loginUser = async (params: IAuth): Promise<ITokens> => {
    const response = await api.post('/api/auth/login', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        localStorage.setItem('user', JSON.stringify(tokens));
    }
    return tokens;
};

export const logoutUser = async () => {
    await api.get('/api/auth/logout', { headers: authHeader() });
    localStorage.removeItem('user');
};

export const getCurrentUser = async (): Promise<IUser | null> => {
    return await api.get('/api/auth/user', { headers: authHeader() });
};

export const getUserTokens = (): ITokens | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};
