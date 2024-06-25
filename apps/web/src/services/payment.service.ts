import { IFindPayment, IPayment } from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export function getPaymentsStub() {
    return [];
}

export async function getPayments(params: IFindPayment): Promise<IPayment[]> {
    const response = await api.post('/api/payments/find', params, { headers: authHeader() });
    return response.data;
}
