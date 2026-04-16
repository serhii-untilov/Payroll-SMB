import { Position } from '@/resources/positions/entities';
import { PayFundGroup } from '@/types';
import { MinWage } from './../../../../resources/min-wage/entities/min-wage.entity';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { Context } from './../../pay-fund-calculation.service';
import { PayFundCalc } from './../abstract/pay-fund-calc';

export class EcbMinWage extends PayFundCalc {
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

    public calculate(ctx: Context, position: Position): PayFund {
        const payFund = this.makePayFund(ctx, position);
        payFund.incomeSum = 0;
        payFund.baseSum = this.calcBaseSum(ctx);
        payFund.rate = this.getRate();
        payFund.paySum = this.calcPaySum(payFund);
        return payFund;
    }

    private getMinWage(minWages: MinWage[]): MinWage | undefined {
        return minWages.find(
            (o) =>
                o.dateFrom.getTime() <= this.accPeriod.dateFrom.getTime() &&
                o.dateTo.getTime() >= this.accPeriod.dateFrom.getTime(),
        );
    }

    private getPriorBaseSum(payFundTypes: PayFundType[]): number {
        const payFundIds = payFundTypes.filter((o) => o.group === PayFundGroup.Ecb).map((o) => o.id);
        return this.current
            .filter((o) => payFundIds.includes(o.payFundTypeId))
            .reduce((a, b) => {
                return a + b.baseSum;
            }, 0);
    }

    private calcBaseSum(ctx: Context): number {
        const minWage = this.getMinWage(ctx.minWages);
        if (!minWage) {
            return 0;
        }
        const minBaseSum = minWage.paySum;
        const priorBaseSum = this.getPriorBaseSum(ctx.payFundTypes);
        if (priorBaseSum > 0 && priorBaseSum < minBaseSum) {
            return minBaseSum - priorBaseSum;
        }
        return 0;
    }

    private getRate(): number {
        // TODO: Apply payFundType config
        return 22;
    }

    private calcPaySum(payFund: PayFund): number {
        return (payFund.baseSum * payFund.rate) / 100;
    }
}
