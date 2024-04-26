import { IWorkNorm, ICreateWorkNorm, IUpdateWorkNorm } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createWorkNorm(workNorm: ICreateWorkNorm): Promise<IWorkNorm> {
    const response = await api.post(`/api/work-norms/`, workNorm, { headers: authHeader() });
    return response.data;
}

export async function getWorkNormList(): Promise<IWorkNorm[]> {
    const response = await api.get(`/api/work-norms/`, { headers: authHeader() });
    return response.data.sort((a: IWorkNorm, b: IWorkNorm) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getWorkNorm(id: number): Promise<IWorkNorm> {
    const response = await api.get(`/api/work-norms/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateWorkNorm(id: number, workNorm: IUpdateWorkNorm): Promise<IWorkNorm> {
    const response = await api.patch(`/api/work-norms/${id}`, workNorm, { headers: authHeader() });
    return response.data;
}

export async function deleteWorkNorm(id: number): Promise<IWorkNorm> {
    const response = await api.delete(`/api/work-norms/${id}`, { headers: authHeader() });
    return response.data;
}

export async function getDefaultWorkNormId(): Promise<number | null> {
    const workNormList = await getWorkNormList();
    return workNormList.length === 1 ? workNormList[0].id : null;
}
