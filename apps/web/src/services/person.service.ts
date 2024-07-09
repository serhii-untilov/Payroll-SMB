import { IPerson, ICreatePerson, IUpdatePerson, IFindPerson } from '@repo/shared';
import { axiosInstance } from '@/api';
import authHeader from './auth-header';

export async function createPerson(person: ICreatePerson): Promise<IPerson> {
    const response = await axiosInstance.post(`/api/persons/`, person, { headers: authHeader() });
    return response.data;
}

export async function getPersonList(relations: boolean = false): Promise<IPerson[]> {
    const response = await axiosInstance.get(`/api/persons/?relations=${relations}`, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPerson(id: number, relations: boolean = false): Promise<IPerson> {
    const response = await axiosInstance.get(`/api/persons/${id}/?relations=${relations}`, {
        headers: authHeader(),
    });
    return response.data;
}

export async function updatePerson(id: number, person: IUpdatePerson): Promise<IPerson> {
    const response = await axiosInstance.patch(`/api/persons/${id}`, person, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePerson(id: number): Promise<IPerson> {
    const response = await axiosInstance.delete(`/api/persons/${id}`, { headers: authHeader() });
    return response.data;
}

export async function findPerson(person: IFindPerson): Promise<IPerson | null> {
    const response = await axiosInstance.post(`/api/persons/find`, person, {
        headers: authHeader(),
    });
    return response.data;
}
