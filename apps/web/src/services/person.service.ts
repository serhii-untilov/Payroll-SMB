import { IPerson, ICreatePerson, IUpdatePerson } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPerson(person: ICreatePerson): Promise<IPerson> {
    const response = await api.post(`/api/persons/`, person, { headers: authHeader() });
    return response.data;
}

export async function getPersonList(
    companyId: number,
    relations: boolean = false,
): Promise<IPerson[]> {
    const response = await api.get(`/api/persons/?companyId=${companyId}&relations=${relations}`, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPerson(id: number): Promise<IPerson> {
    const response = await api.get(`/api/persons/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updatePerson(id: number, person: IUpdatePerson): Promise<IPerson> {
    const response = await api.patch(`/api/persons/${id}`, person, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePerson(id: number): Promise<IPerson> {
    const response = await api.delete(`/api/persons/${id}`, { headers: authHeader() });
    return response.data;
}
