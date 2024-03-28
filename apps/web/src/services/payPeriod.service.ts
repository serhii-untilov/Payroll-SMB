import { ICreatePayPeriod, IPayPeriod, IUpdatePayPeriod } from '@repo/shared';
import { endOfMonth, format, isEqual, startOfDay, startOfMonth } from 'date-fns';
import { t } from 'i18next';
import { api } from '../api';
import authHeader from './auth-header';

export async function createPayPeriod(payPeriod: ICreatePayPeriod): Promise<IPayPeriod> {
    const response = await api.post(`/api/pay-periods/`, payPeriod, { headers: authHeader() });
    return response.data;
}

export async function getPayPeriodList(
    companyId: number,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod[]> {
    const response = await api.get(
        `/api/pay-periods/?companyId=${companyId}&relations=${relations}&fullFieldList=${!!fullFieldList}`,
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function getPayPeriod(
    companyId: number,
    id: number,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod> {
    const response = await api.get(
        `/api/pay-periods/${id}/&companyId=${companyId}&relations=${!!relations}&fullFieldList=${!!fullFieldList}`,
        { headers: authHeader() },
    );
    return response.data;
}

export async function getCurrentPayPeriod(
    companyId: number,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod> {
    const response = await api.get(
        `/api/pay-periods/current/?companyId=${companyId}&relations=${!!relations}&fullFieldList=${!!fullFieldList}`,
        { headers: authHeader() },
    );
    return response.data;
}

export async function updatePayPeriod(
    id: number,
    payPeriod: IUpdatePayPeriod,
): Promise<IPayPeriod> {
    const response = await api.patch(`/api/pay-periods/${id}`, payPeriod, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePayPeriod(id: number): Promise<IPayPeriod> {
    const response = await api.delete(`/api/pay-periods/${id}`, { headers: authHeader() });
    return response.data;
}

export function getPayPeriodName(period: IPayPeriod, isCurrent: boolean, locale: any): string {
    if (!period) return '';
    const state = isCurrent ? `(${t('current')})` : '';
    if (
        isEqual(startOfDay(period.dateFrom), startOfMonth(period.dateFrom)) &&
        isEqual(startOfDay(period.dateTo), startOfDay(endOfMonth(period.dateTo)))
    ) {
        return `${format(period.dateFrom, 'Y LLLL', { locale })} ${state}`;
    }
    return `${format(period.dateFrom, 'Y LLLL', { locale })} ${format(period.dateFrom, 'd')} - ${format(period.dateTo, 'd')} ${state}`;
}
