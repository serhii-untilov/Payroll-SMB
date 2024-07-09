import { axiosInstance } from '@/api';

export async function getGreeting(): Promise<string> {
    const response = await axiosInstance.get('/api');
    return response.data;
}
