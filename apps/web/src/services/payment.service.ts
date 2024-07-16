import { api } from '@/api';
import {
    CreatePaymentDto,
    FindAllPaymentDto,
    FindOnePaymentDto,
    Payment,
    ProcessPaymentDto,
    UpdatePaymentDto,
    WithdrawPaymentDto,
} from '@repo/openapi';

export async function paymentsCreate(payload: CreatePaymentDto): Promise<Payment> {
    return (await api.paymentsCreate(payload)).data;
}

export async function paymentsFindAll(params: FindAllPaymentDto): Promise<Payment[]> {
    const response = await api.paymentsFindAll(params);
    return response.data.sort(
        (a, b) =>
            a.docDate.getTime() - b.docDate.getTime() || Number(a.docNumber) - Number(b.docNumber),
    );
}

export async function paymentsFindOne(id: number, params?: FindOnePaymentDto): Promise<Payment> {
    return (await api.paymentsFindOne(id, params ?? {})).data;
}

export async function paymentsUpdate(id: number, payload: UpdatePaymentDto): Promise<Payment> {
    return (await api.paymentsUpdate(id, payload)).data;
}

export async function paymentsRemove(id: number): Promise<Payment> {
    return (await api.paymentsRemove(id)).data;
}

export async function paymentsProcess(id: number, params: ProcessPaymentDto): Promise<Payment> {
    return (await api.paymentsProcess(id, params)).data;
}

export async function paymentsWithdraw(id: number, params: WithdrawPaymentDto): Promise<Payment> {
    return (await api.paymentsWithdraw(id, params)).data;
}
