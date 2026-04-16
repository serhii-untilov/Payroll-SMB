import { Position } from '@/resources/positions/entities';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PayFundCategory } from '@/types';
import { Context } from '../../pay-fund-calculation.service';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';

export abstract class PayFundCalc {
    // ctx: PayFundCalculationService;
    accPeriod: PayPeriod;
    payFundType: PayFundType;
    current: PayFund[];

    constructor(
        // ctx: PayFundCalculationService,
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ) {
        // this.ctx = ctx;
        this.accPeriod = accPeriod;
        this.payFundType = payFundType;
        this.current = current;
    }

    abstract calculate(ctx: Context, position: Position, payrolls: Payroll[]): PayFund;

    public getNextPayFundId(): string {
        return IdGenerator.nextId();
    }

    public makePayFund(ctx: Context, position: Position): PayFund {
        return Object.assign({
            id: this.getNextPayFundId(),
            positionId: position.id,
            payPeriod: ctx.payPeriod.dateFrom,
            accPeriod: this.accPeriod.dateFrom,
            payFundTypeId: this.payFundType.id,
            payFundCategory: PayFundCategory.Employees,
            incomeSum: 0,
            baseSum: 0,
            rate: 0,
            paySum: 0,
        });
    }
}
