import { IPerson, ICreatePerson, IUpdatePerson, IFindPerson } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPerson(person: ICreatePerson): Promise<IPerson> {
    const response = await api.post(`/api/persons/`, person, { headers: authHeader() });
    return response.data;
}

export async function getPersonList(relations: boolean = false): Promise<IPerson[]> {
    const response = await api.get(`/api/persons/?relations=${relations}`, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPerson(id: number, relations: boolean = false): Promise<IPerson> {
    const response = await api.get(`/api/persons/${id}/?relations=${relations}`, {
        headers: authHeader(),
    });
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

export async function findPerson(person: IFindPerson): Promise<IPerson | null> {
    const response = await api.post(`/api/persons/find`, person, { headers: authHeader() });
    return response.data;
}
