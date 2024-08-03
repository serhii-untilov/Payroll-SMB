import { api } from '../api';

export async function appGetTitle() {
    const response = (await api.appGetTitle()).data;
    return response ?? '';
}
