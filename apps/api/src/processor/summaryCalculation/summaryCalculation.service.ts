import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PayPeriodsService } from '../../resources/pay-periods/pay-periods.service';
import { PayrollsService } from '../../resources/payrolls/payrolls.service';

@Injectable()
export class SummaryCalculationService {
    constructor(
        @Inject(forwardRef(() => PayPeriodsService))
        private payPeriodsService: PayPeriodsService,
        @Inject(forwardRef(() => PayrollsService))
        private payrollsService: PayrollsService,
    ) {}

    calculatePayPeriod(userId: number, id: number) {
        const payPeriod = this.payPeriodsService.findOne(userId, { where: { id } });
    }
}
