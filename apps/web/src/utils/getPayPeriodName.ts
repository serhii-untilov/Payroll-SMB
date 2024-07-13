import { dateUTC, monthBegin, monthEnd } from '@repo/shared';
import { format, isEqual } from 'date-fns';
import { t } from 'i18next';

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
