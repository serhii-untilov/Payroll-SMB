import { accPeriodFactSum } from '@/processor/helpers';
import { CalcMethod, PaymentPart } from '@/types';
import { getMaxDate, getMinDate } from '@repo/shared';
import { PayPeriod } from '@/resources/pay-period/entities/pay-period.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { CalculatePayroll, PayrollContext } from '../base/calculate-payroll.abstract';
import { Position } from '@/resources/positions/entities';

export class PayrollIncomeTax extends CalculatePayroll {
    constructor(ctx: PayrollContext, position: Position, payrolls: Payroll[], accPeriods: PayPeriod[]) {
        super(ctx, position, payrolls, accPeriods);
    }

    calculate(): void {
        const incomeTaxes = this.ctx.paymentTypes.filter((o) => o.calcMethod === CalcMethod.IncomeTax);
        for (const accPeriod of this.accPeriods) {
            const calculatedPayrolls: Payroll[] = [];
            for (const incomeTax of incomeTaxes) {
                const payroll = this.makePayroll(accPeriod, incomeTax.id);
                payroll.dateFrom = getMaxDate(accPeriod.dateFrom, this.position.dateFrom);
                payroll.dateTo = getMinDate(accPeriod.dateTo, this.position.dateTo);
                payroll.planSum = calcPlanSum(this.ctx, accPeriod, this.payrolls);
                payroll.rate = getRate();
                payroll.factSum = calcFactSum(payroll);
                calculatedPayrolls.push(payroll);
            }
            const incomeTaxesIds = incomeTaxes.map((o) => o.id);
            this.merge(incomeTaxesIds, accPeriod, calculatedPayrolls);
        }
    }
}

export function calculateIncomeTax(
    ctx: PayrollContext,
    position: Position,
    payrolls: Payroll[],
    accPeriods: PayPeriod[],
): { toInsert: Payroll[]; toDeleteIds: string[] } {
    const calculator = new PayrollIncomeTax(ctx, position, payrolls, accPeriods);
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
    return 18;
}
