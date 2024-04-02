import { api } from '../api';

export async function getAppTitle(): Promise<string> {
    return await api.post('/api/title/');
}
