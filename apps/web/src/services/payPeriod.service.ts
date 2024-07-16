import { api } from '@/api';
import { FindAllPayPeriodDto, FindCurrentPayPeriodDto } from '@repo/openapi';
import { dateUTC, monthBegin, monthEnd } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { t } from 'i18next';

export async function payPeriodsFindAll(params: FindAllPayPeriodDto) {
    const response = (await api.payPeriodsFindAll(params)).data;
    return response.sort((a, b) => a.dateFrom.getTime() - b.dateFrom.getTime());
}

export async function payPeriodsFindCurrent(params: FindCurrentPayPeriodDto) {
    return (await api.payPeriodsFindCurrent(params)).data;
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

export async function payPeriodsClose(id: number) {
    return (await api.payPeriodsClose(id)).data;
}

export async function payPeriodsOpen(id: number) {
    return (await api.payPeriodsOpen(id)).data;
}
