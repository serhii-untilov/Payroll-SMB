import { Company, CreateCompanyDto, UpdateCompanyDto } from '@repo/openapi';
import { api } from '@/api';

export async function companiesCreate(payload: CreateCompanyDto): Promise<Company> {
    return (await api.companiesCreate(payload)).data;
}

export async function companiesFindAll(): Promise<Company[]> {
    const response = await api.companiesFindAll();
    return response.data.sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()));
}

export async function companiesFindOne(id: number): Promise<Company> {
    return (await api.companiesFindOne(id)).data;
}

export async function updateCompany(id: number, payload: UpdateCompanyDto): Promise<Company> {
    return (await api.companiesUpdate(id, payload)).data;
}

export async function companiesRemove(id: number): Promise<Company> {
    return (await api.companiesRemove(id)).data;
}

export async function companiesSalaryCalculate(id: number) {
    await api.companiesSalaryCalculate(id);
}
