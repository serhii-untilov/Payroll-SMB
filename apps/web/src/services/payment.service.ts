import { ICreatePayment, IFindPayment, IPayment, IUpdatePayment } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPayment(payment: ICreatePayment): Promise<IPayment> {
    const response = await api.post(`/api/payments/`, payment, { headers: authHeader() });
    return response.data;
}

export async function getPayments(params: IFindPayment): Promise<IPayment[]> {
    const response = await api.post('/api/payments/find', params, { headers: authHeader() });
    return response.data.sort((a, b) =>
        a.docDate.getTime() > b.docDate.getTime()
            ? 1
            : a.docDate.getTime() < b.docDate.getTime()
              ? -1
              : Number(a.docNumber) > Number(b.docNumber)
                ? 1
                : Number(a.docNumber) < Number(b.docNumber)
                  ? -1
                  : 0,
    );
}

export async function getPayment(params: {
    id: number;
    relations?: boolean;
    onDate?: Date;
    onPayPeriodDate?: Date | null | undefined;
}): Promise<IPayment> {
    const response = await api.get(
        `/api/payments/${params.id}?relations=${!!params.relations}` +
            (params.onDate ? `&onDate=${params.onDate}` : '') +
            (params.onPayPeriodDate ? `&onPayPeriodDate=${params.onPayPeriodDate}` : ''),
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function updatePayment(id: number, payment: IUpdatePayment): Promise<IPayment> {
    const response = await api.patch(`/api/payments/${id}`, payment, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePayment(id: number): Promise<IPayment> {
    const response = await api.delete(`/api/payments/${id}`, { headers: authHeader() });
    return response.data;
}
