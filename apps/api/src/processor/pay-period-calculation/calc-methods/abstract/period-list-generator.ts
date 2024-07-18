import { PayPeriod } from '@/resources';
import { PayPeriodCalculationService } from '../../pay-period-calculation.service';

export abstract class PeriodListGenerator {
    ctx: PayPeriodCalculationService;

    constructor(ctx: PayPeriodCalculationService) {
        this.ctx = ctx;
    }

    abstract getPeriodList(dateFrom: Date, dateTo: Date): PayPeriod[];

    makePeriod(): PayPeriod {
        return Object.assign({
            id: this.ctx.id,
            companyId: this.ctx.company.id,
        });
    }
}
