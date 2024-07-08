import { ILaw, ICreateLaw, IUpdateLaw } from '@repo/shared';
import { axiosInstance } from '../api';
import authHeader from './auth-header';

export async function createLaw(law: ICreateLaw): Promise<ILaw> {
    const response = await axiosInstance.post(`/api/laws/`, law, { headers: authHeader() });
    return response.data;
}

export async function getLawList(): Promise<ILaw[]> {
    const response = await axiosInstance.get(`/api/laws/`, { headers: authHeader() });
    return response.data.sort((a: ILaw, b: ILaw) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getLaw(id: number): Promise<ILaw> {
    const response = await axiosInstance.get(`/api/laws/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateLaw(id: number, law: IUpdateLaw): Promise<ILaw> {
    const response = await axiosInstance.patch(`/api/laws/${id}`, law, { headers: authHeader() });
    return response.data;
}

export async function deleteLaw(id: number): Promise<ILaw> {
    const response = await axiosInstance.delete(`/api/laws/${id}`, { headers: authHeader() });
    return response.data;
}
