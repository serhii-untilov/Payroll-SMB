import { PayPeriod } from './../../../resources/pay-period/entities/pay-period.entity';
import { PayFund } from './../../../resources/pay-fund/entities/pay-fund.entity';

export function payFundPayPeriodFactSum(payPeriod: PayPeriod, payFunds: PayFund[]): number {
    return payFunds
        .filter(
            (o) =>
                o.payPeriod.getTime() >= payPeriod.dateFrom.getTime() &&
                o.payPeriod.getTime() <= payPeriod.dateTo.getTime(),
        )
        .reduce((a, b) => a + b.paySum, 0);
}
