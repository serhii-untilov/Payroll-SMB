import { accPeriodFactSum } from '@/processor/helpers';
import { CalcMethod, PaymentPart } from '@/types';
import { getMaxDate, getMinDate } from '@repo/shared';
import { PayPeriod } from '@/resources/pay-periods/entities/pay-period.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { CalculatePayroll, PayrollContext } from '../base/calculate-payroll.abstract';
import { Position } from '@/resources/positions/entities';

export class PayrollMilitaryTax extends CalculatePayroll {
    constructor(ctx: PayrollContext, position: Position, payrolls: Payroll[], accPeriods: PayPeriod[]) {
        super(ctx, position, payrolls, accPeriods);
    }

    calculate(): void {
        const militaryTaxes = this.ctx.paymentTypes.filter((o) => o.calcMethod === CalcMethod.MilitaryTax);
        for (const accPeriod of this.accPeriods) {
            const calculatedPayrolls: Payroll[] = [];
            for (const militaryTax of militaryTaxes) {
                const payroll = this.makePayroll(accPeriod, militaryTax.id);
                payroll.dateFrom = getMaxDate(accPeriod.dateFrom, this.position.dateFrom);
                payroll.dateTo = getMinDate(accPeriod.dateTo, this.position.dateTo);
                payroll.planSum = calcPlanSum(this.ctx, accPeriod, this.payrolls);
                payroll.rate = getRate();
                payroll.factSum = calcFactSum(payroll);
                calculatedPayrolls.push(payroll);
            }
            const militaryTaxesIds = militaryTaxes.map((o) => o.id);
            this.merge(militaryTaxesIds, accPeriod, calculatedPayrolls);
        }
    }
}

export function calculateMilitaryTax(
    ctx: PayrollContext,
    position: Position,
    payrolls: Payroll[],
    accPeriods: PayPeriod[],
): { toInsert: Payroll[]; toDeleteIds: string[] } {
    const calculator = new PayrollMilitaryTax(ctx, position, payrolls, accPeriods);
    calculator.calculate();
    return {
        toInsert: calculator.toInsert,
        toDeleteIds: calculator.toDeleteIds,
    };
}

function calcPlanSum(ctx: PayrollContext, accPeriod: PayPeriod, payrolls: Payroll[]): number {
    const paymentTypeIds = ctx.paymentTypes.filter((o) => o.paymentPart === PaymentPart.Accruals).map((o) => o.id);
    return accPeriodFactSum(ctx.payPeriod, accPeriod, payrolls, paymentTypeIds);
}

function calcFactSum(payroll: Payroll): number {
    return (payroll.planSum * payroll.rate) / 100;
}

function getRate(): number {
    return 1.5;
}
