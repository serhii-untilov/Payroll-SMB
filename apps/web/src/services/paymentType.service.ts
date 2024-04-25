import { IPaymentType, ICreatePaymentType, IUpdatePaymentType } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPaymentType(paymentType: ICreatePaymentType): Promise<IPaymentType> {
    const response = await api.post(`/api/payment-types/`, paymentType, { headers: authHeader() });
    return response.data;
}

export async function getPaymentTypeList(): Promise<IPaymentType[]> {
    const response = await api.get(`/api/payment-types/`, { headers: authHeader() });
    return response.data.sort((a: IPaymentType, b: IPaymentType) =>
        a.name.toUpperCase().localeCompare(b.name.toUpperCase()),
    );
}

export async function getPaymentType(id: number): Promise<IPaymentType> {
    const response = await api.get(`/api/payment-types/${id}`, { headers: authHeader() });
    return response.data;
}

export async function updatePaymentType(
    id: number,
    paymentType: IUpdatePaymentType,
): Promise<IPaymentType> {
    const response = await api.patch(`/api/payment-types/${id}`, paymentType, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePaymentType(id: number): Promise<IPaymentType> {
    const response = await api.delete(`/api/payment-types/${id}`, { headers: authHeader() });
    return response.data;
}
