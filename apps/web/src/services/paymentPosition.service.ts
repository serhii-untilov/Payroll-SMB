import {
    ICreatePaymentPosition,
    IFindPaymentPosition,
    IPayment,
    IPaymentPosition,
    IUpdatePaymentPosition,
} from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPaymentPosition(
    payload: ICreatePaymentPosition,
): Promise<IPaymentPosition> {
    const response = await api.post(`/api/payment-positions/`, payload, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPaymentPositions(
    params: IFindPaymentPosition,
): Promise<IPaymentPosition[]> {
    const response = await api.post('/api/payment-positions/find', params, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPaymentPosition(params: {
    id: number;
    relations?: boolean;
}): Promise<IPayment> {
    const response = await api.get(
        `/api/payment-positions/${params.id}?relations=${!!params.relations}`,
        { headers: authHeader() },
    );
    return response.data;
}

export async function updatePaymentPosition(
    id: number,
    payload: IUpdatePaymentPosition,
): Promise<IPayment> {
    const response = await api.patch(`/api/payment-positions/${id}`, payload, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePayment(id: number): Promise<IPaymentPosition> {
    const response = await api.delete(`/api/payment-positions/${id}`, { headers: authHeader() });
    return response.data;
}
