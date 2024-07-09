import {
    ICreatePaymentPosition,
    IFindPaymentPosition,
    IPayment,
    IPaymentPosition,
    IUpdatePaymentPosition,
} from '@repo/shared';
import { axiosInstance } from '@/api';
import authHeader from './auth-header';

export async function createPaymentPosition(
    payload: ICreatePaymentPosition,
): Promise<IPaymentPosition> {
    const response = await axiosInstance.post(`/api/payment-positions/`, payload, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPaymentPositions(
    params: IFindPaymentPosition,
): Promise<IPaymentPosition[]> {
    const response = await axiosInstance.post('/api/payment-positions/find', params, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPaymentPosition(params: {
    id: number;
    relations?: boolean;
}): Promise<IPayment> {
    const response = await axiosInstance.get(
        `/api/payment-positions/${params.id}?relations=${!!params.relations}`,
        { headers: authHeader() },
    );
    return response.data;
}

export async function updatePaymentPosition(
    id: number,
    payload: IUpdatePaymentPosition,
): Promise<IPayment> {
    const response = await axiosInstance.patch(`/api/payment-positions/${id}`, payload, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePayment(id: number): Promise<IPaymentPosition> {
    const response = await axiosInstance.delete(`/api/payment-positions/${id}`, {
        headers: authHeader(),
    });
    return response.data;
}
