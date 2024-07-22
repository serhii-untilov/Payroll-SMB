import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-funds/entities/pay-fund.entity';
import { accPeriodFactSum } from '@/processor/helpers';
import { CalcMethod, PayFundCategory } from '@/types';
import { PaymentGroup } from '@/types';
import { PayFundCalculationService } from './../../pay-fund-calculation.service';
import { PayFundCalc } from './../abstract/pay-fund-calc';

export class EcbSalary extends PayFundCalc {
    constructor(
        ctx: PayFundCalculationService,
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ) {
        super(ctx, accPeriod, payFundType, current);
    }

    calculate(): PayFund {
        const payFund = this.makePayFund();
        payFund.incomeSum = this.calcIncomeSum();
        payFund.baseSum = this.calcBaseSum(payFund);
        payFund.rate = this.getRate();
        payFund.paySum = this.calcPaySum(payFund);
        return payFund;
    }

    private makePayFund(): PayFund {
        return Object.assign({
            id: this.ctx.getNextPayFundId(),
            positionId: this.ctx.position.id,
            payPeriod: this.ctx.payPeriod.dateFrom,
            accPeriod: this.accPeriod.dateFrom,
            payFundTypeId: this.payFundType.id,
            payFundCategory: PayFundCategory.Employees,
            incomeSum: 0,
            baseSum: 0,
            rate: 0,
            paySum: 0,
        });
    }

    getPaymentTypeIds(): number[] {
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
            .filter(
                (o) => calcMethods.includes(o.calcMethod) || paymentGroups.includes(o.paymentGroup),
            )
            .map((o) => o.id);
    }

    calcIncomeSum(): number {
        return accPeriodFactSum(
            this.ctx.payPeriod,
            this.accPeriod,
            this.ctx.payrolls,
            this.getPaymentTypeIds(),
        );
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
