import { add } from 'date-fns';
import { getWorkDayBeforeOrEqual } from './workingTime.helper';
import { monthBegin } from '@repo/shared';

export function getAdvancePaymentDate(payPeriod: Date): Date {
    return getWorkDayBeforeOrEqual(add(monthBegin(payPeriod), { days: 14 }));
}
