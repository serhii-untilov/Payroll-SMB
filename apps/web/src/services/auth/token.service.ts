import { TokensDto } from '@repo/openapi';

export const getUserTokens = (): TokensDto | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
};

export function saveUserTokens(tokens: TokensDto) {
    localStorage.setItem('user', JSON.stringify(tokens));
}

export function removeUserTokens() {
    localStorage.removeItem('user');
}

export function getUserAccessToken(): string {
    return getUserTokens()?.accessToken || '';
}

export function getUserRefreshToken(): string {
    return getUserTokens()?.refreshToken || '';
}
