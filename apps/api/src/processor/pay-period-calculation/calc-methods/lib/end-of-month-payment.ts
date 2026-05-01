import { PayPeriodState } from '@/types';
import { monthBegin, monthEnd } from '@repo/shared';
import { addMonths } from 'date-fns';
import { PayPeriod } from '../../../../resources/pay-period/entities/pay-period.entity';
import { Context, PeriodListGenerator } from '../base/period-list-generator';

export class EndOfMonthPayment extends PeriodListGenerator {
    constructor(ctx: Context) {
        super(ctx);
    }

    public getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[] {
        const periodList: PayPeriod[] = [];
        for (let d = monthBegin(dateFrom); d.getTime() < monthEnd(dateTo).getTime(); d = addMonths(d, 1)) {
            const period = this.makePeriod();
            period.dateFrom = monthBegin(d);
            period.dateTo = monthEnd(d);
            period.state = PayPeriodState.Opened;
            periodList.push(period);
        }
        return periodList;
    }
}
