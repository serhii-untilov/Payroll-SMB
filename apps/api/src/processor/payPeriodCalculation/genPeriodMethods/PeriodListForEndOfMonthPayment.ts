import { PayPeriodState, monthBegin, monthEnd } from '@repo/shared';
import { addMonths } from 'date-fns';
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
            let d = monthBegin(dateFrom);
            d.getTime() < monthEnd(dateTo).getTime();
            d = addMonths(d, 1)
        ) {
            const period = this.makePeriod();
            period.dateFrom = monthBegin(d);
            period.dateTo = monthEnd(d);
            period.state = PayPeriodState.OPENED;
            periodList.push(period);
        }
        return periodList;
    }
}
