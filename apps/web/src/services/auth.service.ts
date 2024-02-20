import { IAuth, ICreateUser, ITokens, IUser } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';
import { saveUserTokens, removeUserTokens } from './token.service';

export const registerUser = async (params: ICreateUser): Promise<ITokens> => {
    const response = await api.post('/api/auth/register', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
};

export const loginUser = async (params: IAuth): Promise<ITokens> => {
    const response = await api.post('/api/auth/login', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
};

export const logoutUser = async () => {
    await api.get('/api/auth/logout', { headers: authHeader() });
    removeUserTokens();
};

export const getCurrentUser = async (): Promise<IUser | null> => {
    return await api.get('/api/auth/user', { headers: authHeader() });
};
