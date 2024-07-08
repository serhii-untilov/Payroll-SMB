import { IAuth, ICreateUser, IPublicUserData, ITokens } from '@repo/shared';
import { axiosInstance } from '../api';
import authHeader from './auth-header';
import { removeUserTokens, saveUserTokens } from './token.service';

export async function registerUser(params: ICreateUser): Promise<ITokens> {
    const response = await axiosInstance.post('/api/auth/register', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function loginUser(params: IAuth): Promise<ITokens> {
    const response = await axiosInstance.post('/api/auth/login', params);
    const tokens: ITokens = response.data;
    if (tokens.accessToken) {
        saveUserTokens(tokens);
    }
    return tokens;
}

export async function logoutUser(): Promise<void> {
    removeUserTokens();
    try {
        await axiosInstance.get('/api/auth/logout', { headers: authHeader() });
        // eslint-disable-next-line no-empty
    } finally {
    }
}

export async function getCurrentUser(): Promise<IPublicUserData> {
    const response = await axiosInstance.get('/api/users/user', { headers: authHeader() });
    return response.data;
}

export async function preview(): Promise<IAuth> {
    const response = await axiosInstance.post('/api/auth/preview');
    return response.data;
}
