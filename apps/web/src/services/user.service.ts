import { api, dto } from '@/api';
import authHeader from './auth-header';
import { FindAllUserCompanyDto } from '@repo/openapi';

export async function usersCompanies(
    userId: number,
    params: FindAllUserCompanyDto,
): Promise<dto.UserCompany[]> {
    const response = (await api.usersCompanies(userId, params)).data ?? [];
    return response.sort((a, b) =>
        (a.company?.name ?? '').toUpperCase().localeCompare((b.company?.name ?? '').toUpperCase()),
    );
}

export async function deleteUserCompany(id: number): Promise<void> {
    await axiosInstance.delete(`/api/users/company/${id}`, { headers: authHeader() });
}

export async function restoreUserCompany(id: number): Promise<void> {
    await axiosInstance.post(`/api/users/company/${id}/restore`, { headers: authHeader() });
}
