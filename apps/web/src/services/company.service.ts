import { api, axiosInstance, dto } from '@/api';
import { Company, UpdateCompanyDto } from '@repo/openapi';
import authHeader from './auth-header';

export async function createCompany(company: dto.CreateCompanyDto): Promise<Company> {
    return (await api.companiesCreate(company)).data;
}

export async function getCompanyList(): Promise<Company[]> {
    const response = await axiosInstance.get(`/api/companies/`, { headers: authHeader() });
    return response.data.sort((a: Company, b: Company) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getCompany(id: number): Promise<Company> {
    const response = await axiosInstance.get(`/api/companies/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateCompany(id: number, company: UpdateCompanyDto): Promise<Company> {
    const response = await axiosInstance.patch(`/api/companies/${id}`, company, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deleteCompany(id: number): Promise<Company> {
    const response = await axiosInstance.delete(`/api/companies/${id}`, { headers: authHeader() });
    return response.data;
}

export async function calculatePayroll(id: number) {
    await axiosInstance.get(`/api/companies/${id}/calculate-payroll`, { headers: authHeader() });
}
