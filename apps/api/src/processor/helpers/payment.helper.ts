import { add } from 'date-fns';
import { getWorkDayBeforeOrEqual } from './workingTime.helper';
import { monthBegin } from '@repo/shared';
import { PayPeriod } from './../../resources/pay-periods/entities/payPeriod.entity';

export function getAdvancePaymentDate(payPeriod: PayPeriod): Date {
    return getWorkDayBeforeOrEqual(add(monthBegin(payPeriod.dateFrom), { days: 14 }));
}

export function getRegularPaymentDate(payPeriod: PayPeriod): Date {
    return getWorkDayBeforeOrEqual(payPeriod.dateTo);
}