import { getUserAccessToken } from './token.service';

export default function authHeader() {
    const accessToken = getUserAccessToken();

    if (accessToken) {
        return { Authorization: `Bearer ${accessToken}` };
    } else {
        return { Authorization: null };
    }
}
