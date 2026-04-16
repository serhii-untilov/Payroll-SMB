import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-funds/entities/pay-fund.entity';
import { accPeriodFactSum } from '@/processor/helpers';
import { CalcMethod, PayFundCategory } from '@/types';
import { PaymentGroup } from '@/types';
import { Context, PayFundCalculationService } from './../../pay-fund-calculation.service';
import { PayFundCalc } from './../abstract/pay-fund-calc';
import { Position } from '@/resources/positions/entities';

export class EcbSalary extends PayFundCalc {
    constructor(
        // ctx: PayFundCalculationService,
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ) {
        super(
            // ctx,
            accPeriod,
            payFundType,
            current,
        );
    }

    calculate(ctx: Context, position: Position): PayFund {
        const payFund = this.makePayFund(ctx, position);
        payFund.incomeSum = this.calcIncomeSum();
        payFund.baseSum = this.calcBaseSum(payFund);
        payFund.rate = this.getRate();
        payFund.paySum = this.calcPaySum(payFund);
        return payFund;
    }

    getPaymentTypeIds(ctx: Context): string[] {
        // TODO: Replace to Entry Table
        const calcMethods: string[] = [CalcMethod.Salary, CalcMethod.Wage];
        const paymentGroups: string[] = [
            PaymentGroup.Adjustments,
            PaymentGroup.Bonuses,
            PaymentGroup.Vacations,
            PaymentGroup.Sicks,
            PaymentGroup.Refunds,
            PaymentGroup.OtherAccruals,
        ];
        return ctx.paymentTypes
            .filter((o) => calcMethods.includes(o.calcMethod) || paymentGroups.includes(o.paymentGroup))
            .map((o) => o.id);
    }

    calcIncomeSum(ctx: Context): number {
        return accPeriodFactSum(ctx.payPeriod, this.accPeriod, ctx.payrolls, this.getPaymentTypeIds(ctx));
    }

    getMinWage() {
        return this.ctx.minWages.find(
            (o) =>
                o.dateFrom.getTime() <= this.accPeriod.dateFrom.getTime() &&
                o.dateTo.getTime() >= this.accPeriod.dateFrom.getTime(),
        );
    }

    getPriorBaseSum(): number {
        // TODO
        return 0;
    }

    calcBaseSum(payFund: PayFund): number {
        const minWage = this.getMinWage();
        if (!minWage) {
            return 0;
        }
        const maxBaseSum = minWage.paySum * 15;
        const priorBaseSum = this.getPriorBaseSum();
        const overallBaseSum = priorBaseSum + payFund.incomeSum;
        if (overallBaseSum > maxBaseSum) {
            return Math.max(0, maxBaseSum - priorBaseSum);
        } else if (overallBaseSum < -maxBaseSum) {
            return Math.min(0, -maxBaseSum + priorBaseSum);
        } else {
            return payFund.incomeSum;
        }
    }

    getRate(): number {
        // TODO: Apply payFundType config
        return 22;
    }

    calcPaySum(payFund: PayFund): number {
        return (payFund.baseSum * payFund.rate) / 100;
    }
}
