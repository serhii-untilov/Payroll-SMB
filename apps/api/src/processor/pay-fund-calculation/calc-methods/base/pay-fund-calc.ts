import { CompanyReadDto } from '@/resources/company/dto/company-read.dto';
import { MinWage } from '@/resources/min-wage/entities/min-wage.entity';
import { PaymentType } from '@/resources/payment-type/entities/payment-type.entity';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { Position } from '@/resources/positions/entities';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PayFundCategory } from '@/types';
import { PayFundType } from '../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from '../../../../resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from '../../../../resources/pay-periods/entities/pay-period.entity';

export type Context = {
    userId: string;
    company: CompanyReadDto;
    paymentTypes: PaymentType[];
    payFundTypes: PayFundType[];
    minWages: MinWage[];
    payPeriod: PayPeriod;
};

export abstract class PayFundCalc {
    constructor(
        public ctx: Context,
        public position: Position,
        public payrolls: Payroll[],
        public accPeriod: PayPeriod,
        public payFundType: PayFundType,
        public current: PayFund[],
    ) {}

    abstract calculate(): PayFund;

    public makePayFund(): PayFund {
        return Object.assign({
            id: IdGenerator.nextId(),
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
