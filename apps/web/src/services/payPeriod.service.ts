import { ICreatePayPeriod, IPayPeriod, IUpdatePayPeriod } from '@repo/shared';
import { endOfMonth, format, isEqual, startOfDay, startOfMonth } from 'date-fns';
import { t } from 'i18next';
import { api } from '../api';
import authHeader from './auth-header';
import { ObjectSchema, date, number, object, string } from 'yup';

export async function createPayPeriod(payPeriod: ICreatePayPeriod): Promise<IPayPeriod> {
    const response = await api.post(`/api/pay-periods/`, payPeriod, { headers: authHeader() });
    return response.data;
}

export async function getPayPeriodList(
    companyId: number | undefined,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod[]> {
    const response = await api.get(
        companyId
            ? `/api/pay-periods/?companyId=${companyId}&relations=${relations}&fullFieldList=${!!fullFieldList}`
            : `/api/pay-periods/`,
        {
            headers: authHeader(),
        },
    );
    return response.data;
}

export async function getPayPeriod(
    companyId: number | undefined,
    id: number,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod> {
    const response = await api.get(
        companyId
            ? `/api/pay-periods/${id}/&companyId=${companyId}&relations=${!!relations}&fullFieldList=${!!fullFieldList}`
            : `/api/pay-periods/${id}`,
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

export async function getCurrentPayPeriodDateFrom(
    companyId: number | undefined,
): Promise<Date | undefined> {
    const payPeriod = companyId ? await getCurrentPayPeriod(companyId) : null;
    return payPeriod?.dateFrom;
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

export function getPayPeriodName(
    dateFrom: Date,
    dateTo: Date,
    isCurrent: boolean,
    locale: any,
): string {
    const state = isCurrent ? `(${t('current')})` : '';
    if (
        isEqual(startOfDay(dateFrom), startOfMonth(dateFrom)) &&
        isEqual(startOfDay(dateTo), startOfDay(endOfMonth(dateTo)))
    ) {
        return `${format(dateFrom, 'Y LLLL', { locale })} ${state}`;
    }
    return `${format(dateFrom, 'Y LLLL', { locale })} ${format(dateFrom, 'd')} - ${format(dateTo, 'd')} ${state}`;
}
