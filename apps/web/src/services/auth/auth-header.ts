import { getUserAccessToken } from './token.service';

export function authHeader(token?: string | undefined) {
    const headerToken = token ?? getUserAccessToken();
    return { Authorization: headerToken ? `Bearer ${headerToken}` : null };
}
