import { api } from '@/api';
import { CreateWorkNormDto, FindWorkNormDto, UpdateWorkNormDto } from '@repo/openapi';

export async function workNormsCreate(payload: CreateWorkNormDto) {
    return (await api.workNormsCreate(payload)).data;
}

export async function workNormsFindAll(params?: FindWorkNormDto) {
    const response = (await api.workNormsFindAll(params ?? {})).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}

export async function workNormsFindOne(id: number, params?: FindWorkNormDto) {
    return (await api.workNormsFindOne(id, params ?? {})).data;
}

export async function workNormsUpdate(id: number, payload: UpdateWorkNormDto) {
    return (await api.workNormsUpdate(id, payload)).data;
}

export async function workNormsRemove(id: number) {
    return (await api.workNormsRemove(id)).data;
}
