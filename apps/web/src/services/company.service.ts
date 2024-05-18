import { ICompany, ICreateCompany, IUpdateCompany } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createCompany(company: ICreateCompany): Promise<ICompany> {
    const response = await api.post(`/api/companies/`, company, { headers: authHeader() });
    return response.data;
}

export async function getCompanyList(): Promise<ICompany[]> {
    const response = await api.get(`/api/companies/`, { headers: authHeader() });
    return response.data.sort((a: ICompany, b: ICompany) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getCompany(id: number): Promise<ICompany> {
    const response = await api.get(`/api/companies/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateCompany(id: number, company: IUpdateCompany): Promise<ICompany> {
    const response = await api.patch(`/api/companies/${id}`, company, { headers: authHeader() });
    return response.data;
}

export async function deleteCompany(id: number): Promise<ICompany> {
    const response = await api.delete(`/api/companies/${id}`, { headers: authHeader() });
    return response.data;
}

export async function salaryCalculate(id: number) {
    await api.get(`/api/companies/${id}/salary-calculate`, { headers: authHeader() });
}
