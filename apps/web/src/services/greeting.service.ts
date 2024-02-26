import { AxiosResponse } from 'axios';
import { api } from '../api';

export async function getGreeting(): Promise<string> {
    const response = await api.get('/api');
    return response.data;
}
