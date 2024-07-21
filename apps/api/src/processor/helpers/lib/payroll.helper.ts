import { Payroll } from './../../../resources/payrolls/entities/payroll.entity';
import { PayPeriod } from './../../../resources/pay-periods/entities/pay-period.entity';
import { RecordFlags } from '@/types';

export function getPayrollUnionRecord(
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
                o.recordFlags & RecordFlags.Cancel,
        )
        .forEach((o) => {
            result.factDays += o.factDays;
            result.factHours += o.factHours;
            result.factSum += o.factSum;
        });
    return result;
}

export function accPeriodFactSum(
    payPeriod: PayPeriod,
    accPeriod: PayPeriod,
    payrolls: Payroll[],
    paymentTypeIds: number[],
): number {
    return payrolls
        .filter(
            (o) =>
                paymentTypeIds.includes(o.paymentTypeId) &&
                o.payPeriod.getTime() <= payPeriod.dateTo.getTime() &&
                o.accPeriod.getTime() >= accPeriod.dateFrom.getTime() &&
                o.accPeriod.getTime() <= accPeriod.dateTo.getTime(),
        )
        .reduce((a, b) => a + b.factSum, 0);
}

export function payPeriodFactSum(
    payPeriod: PayPeriod,
    payrolls: Payroll[],
    paymentTypeIds: number[],
): number {
    return payrolls
        .filter(
            (o) =>
                paymentTypeIds.includes(o.paymentTypeId) &&
                o.payPeriod.getTime() >= payPeriod.dateFrom.getTime() &&
                o.payPeriod.getTime() <= payPeriod.dateTo.getTime(),
        )
        .reduce((a, b) => a + b.factSum, 0);
}
