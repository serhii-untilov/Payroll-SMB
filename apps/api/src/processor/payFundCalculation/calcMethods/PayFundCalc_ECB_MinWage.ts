import { MinWage } from './../../../resources/min-wage/entities/min-wage.entity';
import { PayFundCategory, PayFundGroup } from '@repo/shared';
import { PayFundType } from '../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from '../../../resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from '../../../resources/pay-periods/entities/payPeriod.entity';
import { PayFundCalculationService } from '../payFundCalculation.service';
import { PayFundCalc } from './abstract/PayFundCalc';

export class PayFundCalc_ECB_MinWage extends PayFundCalc {
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
        payFund.incomeSum = 0;
        payFund.baseSum = this.calcBaseSum();
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
            payFundCategory: PayFundCategory.EMPLOYEES,
            incomeSum: 0,
            baseSum: 0,
            rate: 0,
            paySum: 0,
        });
    }

    getMinWage(): MinWage {
        return this.ctx.minWages.find(
            (o) =>
                o.dateFrom.getTime() <= this.accPeriod.dateFrom.getTime() &&
                o.dateTo.getTime() >= this.accPeriod.dateFrom.getTime(),
        );
    }

    getPriorBaseSum(): number {
        const payFundIds = this.ctx.payFundTypes
            .filter((o) => o.group === PayFundGroup.ECB)
            .map((o) => o.id);
        return this.current
            .filter((o) => payFundIds.includes(o.payFundTypeId))
            .reduce((a, b) => {
                return a + b.baseSum;
            }, 0);
    }

    calcBaseSum(): number {
        const minWage = this.getMinWage();
        if (!minWage) {
            return 0;
        }
        const minBaseSum = minWage.paySum;
        const priorBaseSum = this.getPriorBaseSum();
        if (priorBaseSum > 0 && priorBaseSum < minBaseSum) {
            return minBaseSum - priorBaseSum;
        }
        return 0;
    }

    getRate(): number {
        // TODO: Apply payFundType config
        return 22;
    }

    calcPaySum(payFund: PayFund): number {
        return (payFund.baseSum * payFund.rate) / 100;
    }
}
