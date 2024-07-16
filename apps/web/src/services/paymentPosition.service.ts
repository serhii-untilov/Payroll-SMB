import {
    CreatePaymentPositionDto,
    FindAllPaymentPositionDto,
    FindOnePaymentPositionDto,
    PaymentPosition,
} from '@repo/openapi';
import { IPayment, IPaymentPosition, IUpdatePaymentPosition } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function paymentPositionsCreate(
    payload: CreatePaymentPositionDto,
): Promise<PaymentPosition> {
    return (await api.paymentPositionsCreate(payload)).data;
}

export async function paymentPositionsFindAll(
    params: FindAllPaymentPositionDto,
): Promise<PaymentPosition[]> {
    return (await api.paymentPositionsFindAll(params)).data;
}

export async function getPaymentPosition(
    id: number,
    params: FindOnePaymentPositionDto,
): Promise<PaymentPosition> {
    return (await api.paymentPositionsFindOne(id, params)).data;
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
