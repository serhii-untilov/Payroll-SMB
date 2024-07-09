import {
    ICreatePayPeriod,
    IPayPeriod,
    IUpdatePayPeriod,
    dateUTC,
    monthBegin,
    monthEnd,
} from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { t } from 'i18next';
import { axiosInstance } from '@/api';
import authHeader from './auth-header';

export async function createPayPeriod(payPeriod: ICreatePayPeriod): Promise<IPayPeriod> {
    const response = await axiosInstance.post(`/api/pay-periods/`, payPeriod, {
        headers: authHeader(),
    });
    return response.data;
}

export async function getPayPeriodList(
    companyId: number | undefined,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod[]> {
    const response = await axiosInstance.get(
        companyId
            ? `/api/pay-periods/?companyId=${companyId}&relations=${relations}&fullFieldList=${!!fullFieldList}`
            : `/api/pay-periods/`,
        {
            headers: authHeader(),
        },
    );
    return response.data.sort(
        (a: IPayPeriod, b: IPayPeriod) => a.dateFrom.getTime() - b.dateFrom.getTime(),
    );
}

export async function getPayPeriod(
    companyId: number | undefined,
    id: number,
    relations: boolean = false,
    fullFieldList: boolean = false,
): Promise<IPayPeriod> {
    const response = await axiosInstance.get(
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
    const response = await axiosInstance.get(
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
    const response = await axiosInstance.patch(`/api/pay-periods/${id}`, payPeriod, {
        headers: authHeader(),
    });
    return response.data;
}

export async function deletePayPeriod(id: number): Promise<IPayPeriod> {
    const response = await axiosInstance.delete(`/api/pay-periods/${id}`, {
        headers: authHeader(),
    });
    return response.data;
}

export function getPayPeriodName(
    dateFrom: Date,
    dateTo: Date,
    isCurrent: boolean,
    locale: any,
    template: string = 'y LLLL',
): string {
    const state = isCurrent ? `(${t('current')})` : '';
    if (
        isEqual(dateUTC(dateFrom), monthBegin(dateFrom)) &&
        isEqual(dateUTC(dateTo), monthEnd(dateTo))
    ) {
        return `${format(dateFrom, template, { locale })} ${state}`;
    }
    return `${format(dateFrom, template, { locale })} ${format(dateFrom, 'd')} - ${format(dateTo, 'd')} ${state}`;
}

export async function closePayPeriod(currentPayPeriod: IPayPeriod): Promise<IPayPeriod> {
    const response = await axiosInstance.post(
        `/api/pay-periods/close/${currentPayPeriod.id}`,
        { version: currentPayPeriod.version },
        { headers: authHeader() },
    );
    return response.data;
}

export async function openPayPeriod(currentPayPeriod: IPayPeriod): Promise<IPayPeriod> {
    const response = await axiosInstance.post(
        `/api/pay-periods/open/${currentPayPeriod.id}`,
        { version: currentPayPeriod.version },
        { headers: authHeader() },
    );
    return response.data;
}
