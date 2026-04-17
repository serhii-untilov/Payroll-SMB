import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { Position } from '@/resources/positions/entities';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PayFundCategory } from '@/types';
import { PayFundType } from '../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from '../../../../resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from '../../../../resources/pay-periods/entities/pay-period.entity';
import { CompanyReadDto } from '@/resources/company/dto/company-read.dto';
import { PaymentType } from '@/resources/payment-types/entities/payment-type.entity';
import { MinWage } from '@/resources/min-wage/entities/min-wage.entity';

export type Context = {
    userId: string;
    company: CompanyReadDto;
    paymentTypes: PaymentType[];
    payFundTypes: PayFundType[];
    minWages: MinWage[];
    payPeriod: PayPeriod;
};

export abstract class PayFundCalc {
    ctx: Context;
    position: Position;
    payrolls: Payroll[];
    accPeriod: PayPeriod;
    payFundType: PayFundType;
    current: PayFund[];

    constructor(
        ctx: Context,
        position: Position,
        payrolls: Payroll[],
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ) {
        this.ctx = ctx;
        this.position = position;
        this.payrolls = payrolls;
        this.accPeriod = accPeriod;
        this.payFundType = payFundType;
        this.current = current;
    }

    abstract calculate(): PayFund;

    public getNextPayFundId(): string {
        return IdGenerator.nextId();
    }

    public makePayFund(): PayFund {
        return Object.assign({
            id: this.getNextPayFundId(),
            positionId: this.position.id,
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
}
