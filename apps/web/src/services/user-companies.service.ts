import { FindAllUserCompanyDto } from '@repo/openapi';
import { api } from '@/api';

export async function userCompaniesFindAll(params: FindAllUserCompanyDto) {
    const response = (await api.userCompaniesFindAll(params)).data;
    return response.sort((a, b) =>
        (a.company?.name || '').toUpperCase().localeCompare((b.company?.name || '').toUpperCase()),
    );
}

export async function userCompaniesRemove(id: number) {
    await api.userCompaniesRemove(id);
}

export async function userCompaniesRestore(id: number) {
    await api.userCompaniesRestore(id);
}
