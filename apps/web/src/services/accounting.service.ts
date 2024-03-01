import { IAccounting, ICreateAccounting, IUpdateAccounting } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createAccounting(accounting: ICreateAccounting): Promise<IAccounting> {
    const response = await api.post(`/api/accounting/`, accounting, { headers: authHeader() });
    return response.data;
}

export async function getAccountingList(): Promise<IAccounting[]> {
    const response = await api.get(`/api/accounting/`, { headers: authHeader() });
    return response.data;
}

export async function getAccounting(id: number): Promise<IAccounting> {
    const response = await api.get(`/api/accounting/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updateAccounting(
    id: number,
    accounting: IUpdateAccounting,
): Promise<IAccounting> {
    const response = await api.patch(`/api/accounting/${id}`, accounting, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deleteAccounting(id: number): Promise<IAccounting> {
    const response = await api.delete(`/api/accounting/${id}`, { headers: authHeader() });
    return response.data;
}
