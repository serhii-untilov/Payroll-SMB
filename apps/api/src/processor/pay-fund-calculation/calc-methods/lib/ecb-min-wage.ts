import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { Position } from '@/resources/positions/entities/position.entity';
import { PayFundGroup } from '@/types';
import { Context, PayFundCalc } from '../base/pay-fund-calc';
import { MinWage } from './../../../../resources/min-wage/entities/min-wage.entity';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-fund/entities/pay-fund.entity';
import { PayPeriod } from './../../../../resources/pay-period/entities/pay-period.entity';

export class EcbMinWage extends PayFundCalc {
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

    public calculate(): PayFund {
        const payFund = this.makePayFund();
        payFund.incomeSum = 0;
        payFund.baseSum = this.calcBaseSum();
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

    private calcBaseSum(): number {
        const minWage = this.getMinWage(this.ctx.minWages);
        if (!minWage) {
            return 0;
        }
        const minBaseSum = minWage.paySum;
        const priorBaseSum = this.getPriorBaseSum(this.ctx.payFundTypes);
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
