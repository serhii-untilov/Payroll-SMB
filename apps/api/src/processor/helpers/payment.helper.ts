import { add } from 'date-fns';
import { getWorkDayBeforeOrEqual } from './workingTime.helper';
import { monthBegin } from '@repo/shared';
import { PayPeriod } from './../../resources/pay-periods/entities/payPeriod.entity';
import { PaymentPosition } from '../../resources/payments/payment-positions/entities/paymentPosition.entity';

export function getAdvancePaymentDate(payPeriod: PayPeriod): Date {
    return getWorkDayBeforeOrEqual(add(monthBegin(payPeriod.dateFrom), { days: 14 }));
}

export function getRegularPaymentDate(payPeriod: PayPeriod): Date {
    return getWorkDayBeforeOrEqual(payPeriod.dateTo);
}

export function getTotals(paymentPositions: PaymentPosition[], accPeriod: Date) {
    return paymentPositions
        .filter((o) => o.payment.accPeriod.getTime() === accPeriod.getTime())
        .reduce(
            (a, b) => {
                a.baseSum += b.baseSum;
                a.deductions += b.deductions;
                a.paySum += b.paySum;
                a.funds += b.funds;
                return a;
            },
            { baseSum: 0, deductions: 0, paySum: 0, funds: 0 },
        );
}
