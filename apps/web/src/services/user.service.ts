import { ICompany, IPublicUserData, IUpdateUser } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function updateUser(id: number, user: IUpdateUser): Promise<IPublicUserData> {
    const response = await api.patch(`/api/users/${id}`, user, { headers: authHeader() });
    return response.data;
}

export async function getUserCompanyList(id: number): Promise<ICompany[]> {
    const response = await api.get(`/api/users/${id}/companies`, { headers: authHeader() });
    return response.data;
}
