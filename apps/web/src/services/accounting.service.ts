import { IAccounting, ICreateAccounting, IUpdateAccounting } from '@repo/shared';
import { axiosInstance } from '../api';
import authHeader from './auth-header';

export async function createAccounting(accounting: ICreateAccounting): Promise<IAccounting> {
    const response = await axiosInstance.post(`/api/accounting/`, accounting, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getAccountingList(): Promise<IAccounting[]> {
    const response = await axiosInstance.get(`/api/accounting/`, { headers: authHeader() });
    return response.data.sort((a: IAccounting, b: IAccounting) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getAccounting(id: number): Promise<IAccounting> {
    const response = await axiosInstance.get(`/api/accounting/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateAccounting(
    id: number,
    accounting: IUpdateAccounting,
): Promise<IAccounting> {
    const response = await axiosInstance.patch(`/api/accounting/${id}`, accounting, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deleteAccounting(id: number): Promise<IAccounting> {
    const response = await axiosInstance.delete(`/api/accounting/${id}`, { headers: authHeader() });
    return response.data;
}
