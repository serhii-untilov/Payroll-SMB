import { PayPeriod } from './../../../resources/pay-periods/entities/pay-period.entity';
import { PayPeriodState } from '@/types';
import { monthBegin, monthEnd } from '@repo/shared';
import { addMonths } from 'date-fns';
import { PayPeriodCalculationService } from '../pay-period-calculation.service';
import { PeriodListGenerator } from './abstract/period-list-generator';

export class EndOfMonthPayment extends PeriodListGenerator {
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
            period.state = PayPeriodState.Opened;
            periodList.push(period);
        }
        return periodList;
    }
}
