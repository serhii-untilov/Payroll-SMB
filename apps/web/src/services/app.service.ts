import { api } from '../api';

export async function appGetTitle(): Promise<string> {
    const response = await api.appGetTitle();
    return response.data ?? '';
}
