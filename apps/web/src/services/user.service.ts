import { FindAllUserCompanyDto, UpdateUserDto } from '@repo/openapi';
import { api } from '@/api';

export async function usersUpdate(id: number, payload: UpdateUserDto) {
    return (await api.usersUpdate(id, payload)).data;
}

export async function usersCompanies(userId: number, params?: FindAllUserCompanyDto) {
    const response = (await api.usersCompanies(userId, params ?? {})).data;
    return response.sort((a, b) =>
        (a.company?.name || '').toUpperCase().localeCompare((b.company?.name || '').toUpperCase()),
    );
}

export async function usersCompaniesRemove(id: number) {
    await api.usersCompaniesRemove(id);
}

export async function usersCompaniesRestore(id: number) {
    await api.usersCompaniesRestore(id);
}
