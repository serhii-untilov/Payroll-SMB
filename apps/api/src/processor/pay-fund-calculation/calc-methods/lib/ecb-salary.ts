import { accPeriodFactSum } from '@/processor/helpers';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { Position } from '@/resources/positions/entities';
import { CalcMethod, PaymentGroup } from '@/types';
import { Context, PayFundCalc } from '../base/pay-fund-calc';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-fund/entities/pay-fund.entity';
import { PayPeriod } from './../../../../resources/pay-period/entities/pay-period.entity';

export class EcbSalary extends PayFundCalc {
    constructor(
        ctx: Context,
        position: Position,
        payrolls: Payroll[],
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ) {
        super(ctx, position, payrolls, accPeriod, payFundType, current);
    }

    calculate(): PayFund {
        const payFund = this.makePayFund();
        payFund.incomeSum = this.calcIncomeSum();
        payFund.baseSum = this.calcBaseSum(payFund);
        payFund.rate = this.getRate();
        payFund.paySum = this.calcPaySum(payFund);
        return payFund;
    }

    getPaymentTypeIds(): string[] {
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
        return this.ctx.paymentTypes
            .filter((o) => calcMethods.includes(o.calcMethod) || paymentGroups.includes(o.paymentGroup))
            .map((o) => o.id);
    }

    calcIncomeSum(): number {
        return accPeriodFactSum(this.ctx.payPeriod, this.accPeriod, this.payrolls, this.getPaymentTypeIds());
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
