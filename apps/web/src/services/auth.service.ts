import { IAuth, ICreateUser, IPublicUserData, ITokens } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';
import { removeUserTokens, saveUserTokens } from './token.service';

export async function registerUser(params: ICreateUser): Promise<ITokens> {
    const response = await api.post('/api/auth/register', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function loginUser(params: IAuth): Promise<ITokens> {
    const response = await api.post('/api/auth/login', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function logoutUser() {
    await api.get('/api/auth/logout', { headers: authHeader() });
    removeUserTokens();
}

export async function getCurrentUser(): Promise<IPublicUserData> {
    const response = await api.get('/api/users/user', { headers: authHeader() });
    return response.data;
}

export async function preview(): Promise<IAuth> {
    const response = await api.post('/api/auth/preview');
    return response.data;
}
