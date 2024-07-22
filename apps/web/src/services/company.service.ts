import { api } from '@/api';
import { CreateCompanyDto, UpdateCompanyDto } from '@repo/openapi';

export async function companiesCreate(payload: CreateCompanyDto) {
    return (await api.companiesCreate(payload)).data;
}

export async function companiesFindAll() {
    const response = (await api.companiesFindAll()).data;
    return response.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}

export async function companiesFindOne(id: number) {
    return (await api.companiesFindOne(id)).data;
}

export async function updateCompany(id: number, payload: UpdateCompanyDto) {
    return (await api.companiesUpdate(id, payload)).data;
}

export async function companiesRemove(id: number) {
    return (await api.companiesRemove(id)).data;
}

export async function companiesSalaryCalculate(id: number) {
    await api.companiesSalaryCalculate(id);
}
