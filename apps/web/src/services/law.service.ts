import { api } from '@/api';

export async function lawsFindAll() {
    const response = (await api.lawsFindAll()).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}
