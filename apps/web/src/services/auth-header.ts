import { getUserAccessToken } from './token.service';

export default function authHeader(token?: string | undefined) {
    const headerToken = token ?? getUserAccessToken();

    if (headerToken) {
        return { Authorization: `Bearer ${headerToken}` };
    } else {
        return { Authorization: null };
    }
}
