import {
    IPaymentType,
    ICreatePaymentType,
    IUpdatePaymentType,
    IPaymentTypeFilter,
    PaymentGroup,
    CalcMethod,
} from '@repo/shared';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPaymentType(paymentType: ICreatePaymentType): Promise<IPaymentType> {
    const response = await api.post(`/api/payment-types/`, paymentType, { headers: authHeader() });
    return response.data;
}

export async function getPaymentTypeList(
    filter: IPaymentTypeFilter | null = null,
): Promise<IPaymentType[]> {
    const part = filter?.part ? `?part=${encodeURIComponent(filter?.part)}` : '';
    const groups = filter?.groups
        ? `?groups=${encodeURIComponent(JSON.stringify(filter?.groups))}`
        : '';
    const methods = filter?.methods
        ? `?methods=${encodeURIComponent(JSON.stringify(filter?.methods))}`
        : '';
    const ids = filter?.ids ? `?ids=${encodeURIComponent(JSON.stringify(filter?.ids))}` : '';
    const response = await api.get(`/api/payment-types/${part}${groups}${methods}${ids}`, {
        headers: authHeader(),
    });
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

export async function getDefaultBasicPaymentTypeId(): Promise<number> {
    const basic: IPaymentType[] = await getPaymentTypeList({ methods: [CalcMethod.SALARY] });
    return Math.min(...basic.map((o) => o.id));
}
