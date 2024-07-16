import { Job } from '@repo/openapi';
import { api } from '@/api';

export async function jobsFindAll(): Promise<Job[]> {
    const response = await api.jobsFindAll();
    return response.data.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}
