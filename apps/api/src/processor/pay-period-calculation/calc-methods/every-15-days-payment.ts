import { PayPeriod } from './../../../resources/pay-periods/entities/pay-period.entity';
import { PayPeriodState } from '@/types';
import { monthBegin, monthEnd } from '@repo/shared';
import { addDays, addMonths } from 'date-fns';
import { PayPeriodCalculationService } from '../pay-period-calculation.service';
import { PeriodListGenerator } from './abstract/period-list-generator';

export class Every15daysPayment extends PeriodListGenerator {
    constructor(ctx: PayPeriodCalculationService) {
        super(ctx);
    }

    public getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[] {
        const periodList: PayPeriod[] = [];
        for (
            let d = monthBegin(dateFrom);
            d.getTime() < monthEnd(dateTo).getTime();
            d = addMonths(d, 1)
        ) {
            const period1 = this.makePeriod();
            period1.dateFrom = monthBegin(d);
            period1.dateTo = addDays(period1.dateFrom, 14);
            period1.state = PayPeriodState.Opened;
            periodList.push(period1);

            const period2 = this.makePeriod();
            period2.dateFrom = addDays(period1.dateTo, 1);
            period2.dateTo = monthEnd(d);
            period2.state = PayPeriodState.Opened;
            periodList.push(period2);
        }
        return periodList;
    }
}
