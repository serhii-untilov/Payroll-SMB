import { AxiosResponse } from 'axios';
import { api } from '../api';

export function getGreeting(): Promise<AxiosResponse> {
    return api.get('/api');
}
