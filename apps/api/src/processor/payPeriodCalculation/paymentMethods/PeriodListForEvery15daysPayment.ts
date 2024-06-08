import { PayPeriodState } from '@repo/shared';
import { addDays, addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { PayPeriod } from '../../../resources/pay-periods/entities/payPeriod.entity';
import { PayPeriodCalculationService } from '../payPeriodCalculation.service';
import { PeriodListGenerator } from './abstract/PeriodListGenerator';

export class PeriodListForEvery15daysPayment extends PeriodListGenerator {
    constructor(ctx: PayPeriodCalculationService) {
        super(ctx);
    }

    public getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[] {
        const periodList: PayPeriod[] = [];
        for (
            let d = startOfMonth(dateFrom);
            d.getTime() < endOfMonth(dateTo).getTime();
            d = addMonths(d, 1)
        ) {
            const period1 = this.makePeriod();
            period1.dateFrom = startOfMonth(d);
            period1.dateTo = addDays(period1.dateFrom, 14);
            period1.state = PayPeriodState.OPENED;
            periodList.push(period1);

            const period2 = this.makePeriod();
            period2.dateFrom = addDays(period1.dateTo, 1);
            period2.dateTo = endOfMonth(d);
            period2.state = PayPeriodState.OPENED;
            periodList.push(period2);
        }
        return periodList;
    }
}
