import { Law } from '@repo/openapi';
import { api } from '@/api';

export async function lawsFindAll(): Promise<Law[]> {
    const response = await api.lawsFindAll();
    return response.data.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}
