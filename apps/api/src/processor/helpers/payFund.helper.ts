import { PayFund } from '@/resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from '@/resources/pay-periods/entities/pay-period.entity';

export function payFundPayPeriodFactSum(payPeriod: PayPeriod, payFunds: PayFund[]): number {
    return payFunds
        .filter(
            (o) =>
                o.payPeriod.getTime() >= payPeriod.dateFrom.getTime() &&
                o.payPeriod.getTime() <= payPeriod.dateTo.getTime(),
        )
        .reduce((a, b) => a + b.paySum, 0);
}
