import { PayPeriodState } from '@repo/shared';
import { addMonths, endOfMonth, startOfMonth } from 'date-fns';
import { PayPeriod } from '../../../resources/pay-periods/entities/payPeriod.entity';
import { PayPeriodCalculationService } from '../payPeriodCalculation.service';
import { PeriodListGenerator } from './abstract/PeriodListGenerator';

export class PeriodListForEndOfMonthPayment extends PeriodListGenerator {
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
            const period = this.makePeriod();
            period.dateFrom = startOfMonth(d);
            period.dateTo = endOfMonth(d);
            period.state = PayPeriodState.OPENED;
            periodList.push(period);
        }
        return periodList;
    }
}
