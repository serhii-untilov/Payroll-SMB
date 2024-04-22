import { api } from '../api';

export async function getAppTitle(): Promise<string> {
    const response = await api.get('/api/title/');
    return response.data;
}
