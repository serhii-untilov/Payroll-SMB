import { api } from '@/api';

export async function jobsFindAll() {
    const response = (await api.jobsFindAll()).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}
