import { accPeriodFactSum } from '@/processor/helpers';
import { CalcMethod, RecordFlags } from '@/types';
import { getMaxDate, getMinDate, PaymentPart } from '@repo/shared';
import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { PaymentType } from './../../../../resources/payment-types/entities/payment-type.entity';
import { Payroll } from './../../../../resources/payrolls/entities/payroll.entity';
import { PayrollCalculationService } from './../../payroll-calculation.service';

export function calculateIncomeTax(ctx: PayrollCalculationService) {
    const incomeTaxes = ctx.paymentTypes.filter((o) => o.calcMethod === CalcMethod.IncomeTax);
    for (const accPeriod of ctx.accPeriods) {
        const payrolls: Payroll[] = [];
        for (const incomeTax of incomeTaxes) {
            const dateFrom = getMaxDate(accPeriod.dateFrom, ctx.position.dateFrom);
            const dateTo = getMinDate(accPeriod.dateTo, ctx.position.dateTo);
            const payroll = makePayroll(ctx, accPeriod, incomeTax, dateFrom, dateTo);
            payroll.planSum = calcPlanSum(ctx, accPeriod);
            payroll.rate = getRate();
            payroll.factSum = calcFactSum(payroll);
            payrolls.push(payroll);
        }
        const incomeTaxesIds = incomeTaxes.map((o) => o.id);
        ctx.merge(incomeTaxesIds, accPeriod, payrolls);
    }
}

function makePayroll(
    ctx: PayrollCalculationService,
    accPeriod: PayPeriod,
    paymentType: PaymentType,
    dateFrom: Date,
    dateTo: Date,
): Payroll {
    const payroll = Object.assign({
        id: ctx.getNextPayrollId(),
        positionId: ctx.position.id,
        payPeriod: ctx.payPeriod.dateFrom,
        accPeriod: accPeriod.dateFrom,
        paymentTypeId: paymentType.id,
        dateFrom,
        dateTo,
        factSum: 0,
        recordFlags: RecordFlags.Auto,
    });
    return payroll;
}

function calcPlanSum(ctx: PayrollCalculationService, accPeriod: PayPeriod): number {
    // TODO: Entry Table
    const paymentTypeIds = ctx.paymentTypes
        .filter((o) => o.paymentPart === PaymentPart.Accruals)
        .map((o) => o.id);
    const payrolls = ctx.getPayrollsAccPeriod(accPeriod.dateFrom);
    return accPeriodFactSum(ctx.payPeriod, accPeriod, payrolls, paymentTypeIds);
}

function calcFactSum(payroll: Payroll): number {
    return (payroll.planSum * payroll.rate) / 100;
}

function getRate(): number {
    return 18; // TODO
}
