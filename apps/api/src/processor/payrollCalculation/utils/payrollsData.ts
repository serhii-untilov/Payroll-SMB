import { RecordFlags } from '@repo/shared';
import { PayPeriod } from '../../../resources/pay-periods/entities/pay-period.entity';
import { Payroll } from '../../../resources/payrolls/entities/payroll.entity';
import { PayrollCalculationService } from '../payrollCalculation.service';

export function getPayrollUnionCancel(
    payroll: Payroll,
    payrolls: Payroll[],
    payPeriod: PayPeriod,
): Payroll {
    const result = Object.assign(payroll);
    payrolls
        .filter(
            (o) =>
                o.parentId === payroll.id &&
                o.payPeriod.getTime() <= payPeriod.dateTo.getTime() &&
                o.recordFlags & RecordFlags.CANCEL,
        )
        .forEach((o) => {
            result.factDays += o.factDays;
            result.factHours += o.factHours;
            result.factSum += o.factSum;
        });
    return result;
}

export function accPeriodFactSum(
    ctx: PayrollCalculationService,
    accPeriod: Date,
    paymentTypeIds: number[],
) {
    const payrolls = ctx.getPayrollsAccPeriod(accPeriod);
    return payrolls
        .filter((o) => paymentTypeIds.includes(o.paymentTypeId))
        .reduce((a, b) => a + b.factSum, 0);
}
