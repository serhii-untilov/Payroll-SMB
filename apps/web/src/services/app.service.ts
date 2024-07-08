import { axiosInstance } from '../api';

export async function getAppTitle(): Promise<string> {
    const response = await axiosInstance.get('/api/title/');
    return response.data;
}
