import { CalcMethod, PaymentPart, RecordFlags, getMaxDate, getMinDate } from '@repo/shared';
import { PayPeriod } from '../../../resources/pay-periods/entities/pay-period.entity';
import { PaymentType } from '../../../resources/payment-types/entities/payment-type.entity';
import { Payroll } from '../../../resources/payrolls/entities/payroll.entity';
import { PayrollCalculationService } from '../payrollCalculation.service';
import { accPeriodFactSum } from '../../helpers/payroll.helper';

export function calculateMilitaryTax(ctx: PayrollCalculationService) {
    const militaryTaxes = ctx.paymentTypes.filter((o) => o.calcMethod === CalcMethod.MILITARY_TAX);
    for (const accPeriod of ctx.accPeriods) {
        const payrolls: Payroll[] = [];
        for (const militaryTax of militaryTaxes) {
            const dateFrom = getMaxDate(accPeriod.dateFrom, ctx.position.dateFrom);
            const dateTo = getMinDate(accPeriod.dateTo, ctx.position.dateTo);
            const payroll = makePayroll(ctx, accPeriod, militaryTax, dateFrom, dateTo);
            payroll.planSum = calcPlanSum(ctx, accPeriod);
            payroll.rate = getRate();
            payroll.factSum = calcFactSum(payroll);
            payrolls.push(payroll);
        }
        const militaryTaxesIds = militaryTaxes.map((o) => o.id);
        ctx.merge(militaryTaxesIds, accPeriod, payrolls);
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
        recordFlags: RecordFlags.AUTO,
    });
    return payroll;
}

function calcPlanSum(ctx: PayrollCalculationService, accPeriod: PayPeriod) {
    // TODO: Entry Table
    const paymentTypeIds = ctx.paymentTypes
        .filter((o) => o.paymentPart === PaymentPart.ACCRUALS)
        .map((o) => o.id);
    const payrolls = ctx.getPayrollsAccPeriod(accPeriod.dateFrom);
    return accPeriodFactSum(ctx.payPeriod, accPeriod, payrolls, paymentTypeIds);
}

function calcFactSum(payroll: Payroll) {
    return (payroll.planSum * payroll.rate) / 100;
}

function getRate() {
    return 1.5; // TODO
}
