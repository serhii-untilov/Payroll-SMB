import { api } from '@/api';
import {
    CreatePaymentDto,
    FindAllPaymentDto,
    FindOnePaymentDto,
    ProcessPaymentDto,
    UpdatePaymentDto,
    WithdrawPaymentDto,
} from '@repo/openapi';

export async function paymentsCreate(payload: CreatePaymentDto) {
    return (await api.paymentsCreate(payload)).data;
}

export async function paymentsFindAll(params: FindAllPaymentDto) {
    const response = (await api.paymentsFindAll(params)).data;
    return response.sort(
        (a, b) =>
            a.docDate.getTime() - b.docDate.getTime() || Number(a.docNumber) - Number(b.docNumber),
    );
}

export async function paymentsFindOne(id: number, params?: FindOnePaymentDto) {
    return (await api.paymentsFindOne(id, params ?? {})).data;
}

export async function paymentsUpdate(id: number, payload: UpdatePaymentDto) {
    return (await api.paymentsUpdate(id, payload)).data;
}

export async function paymentsRemove(id: number) {
    return (await api.paymentsRemove(id)).data;
}

export async function paymentsProcess(id: number, params: ProcessPaymentDto) {
    return (await api.paymentsProcess(id, params)).data;
}

export async function paymentsWithdraw(id: number, params: WithdrawPaymentDto) {
    return (await api.paymentsWithdraw(id, params)).data;
}
