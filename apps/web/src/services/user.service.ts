import { IPublicUserData, IUpdateUser, IUserCompany } from '@repo/shared';
import { axiosInstance } from '../api';
import authHeader from './auth-header';

export async function updateUser(id: number, user: IUpdateUser): Promise<IPublicUserData> {
    const response = await axiosInstance.patch(`/api/users/${id}`, user, { headers: authHeader() });
    return response.data;
}

export async function getUserCompanyList(
    id: number,
    relations: boolean = false,
    deleted: boolean = false,
): Promise<IUserCompany[]> {
    const response = await axiosInstance.get(
        `/api/users/${id}/companies?relations=${relations}${deleted ? '&deleted=true' : ''}`,
        {
            headers: authHeader(),
        },
    );
    return response.data.sort((a: IUserCompany, b: IUserCompany) =>
        a.company?.name.toUpperCase().localeCompare((b.company?.name || '').toUpperCase()),
    );
}

export async function deleteUserCompany(id: number): Promise<void> {
    await axiosInstance.delete(`/api/users/company/${id}`, { headers: authHeader() });
}

export async function restoreUserCompany(id: number): Promise<void> {
    await axiosInstance.post(`/api/users/company/${id}/restore`, { headers: authHeader() });
}
