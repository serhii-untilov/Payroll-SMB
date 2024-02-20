import { ITokens } from '@repo/shared';

export const getUserTokens = (): ITokens | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

export function saveUserTokens(tokens: ITokens) {
    localStorage.setItem('user', JSON.stringify(tokens));
}

export function removeUserTokens() {
    localStorage.removeItem('user');
}

export function getUserAccessToken() {
    return getUserTokens()?.accessToken;
}

export function getUserRefreshToken() {
    return getUserTokens()?.refreshToken;
}
