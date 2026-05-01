import { CompanyReadDto } from '@/resources/company/dto/company-read.dto';
import { PayFund } from '@/resources/pay-funds/entities/pay-fund.entity';
import { PayPeriod } from '@/resources/pay-period/entities';
import { Payroll } from '@/resources/payrolls/entities/payroll.entity';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { PaymentStatus, RecordFlag } from '@/types';
import { PaymentPosition } from '../../../../resources/payment-positions/entities/paymentPosition.entity';
import { PaymentType } from '../../../../resources/payment-type/entities/payment-type.entity';
import { Payment } from '../../../../resources/payments/entities/payment.entity';
import { Position } from '@/resources/positions/entities';

export type PaymentContext = {
    userId: string;
    company: CompanyReadDto;
    paymentTypes: PaymentType[];
    payrolls: Payroll[];
    payFunds: PayFund[];
    payPeriod: PayPeriod;
};

export abstract class CalcPayment {
    constructor(
        public ctx: PaymentContext,
        public position: Position,
        public paymentType: PaymentType,
        public current: PaymentPosition[],
    ) {}

    abstract calculate(): PaymentPosition;

    public makePayment(): Payment {
        return Object.assign({
            id: 0,
            companyId: this.ctx.company.id,
            payPeriod: this.ctx.payPeriod.dateFrom,
            accPeriod: this.ctx.payPeriod.dateFrom,
            docNumber: null,
            docDate: null,
            paymentTypeId: this.paymentType.id,
            dateFrom: this.ctx.payPeriod.dateFrom,
            dateTo: this.ctx.payPeriod.dateTo,
            baseSum: 0,
            deductions: 0,
            paySum: 0,
            funds: 0,
            status: PaymentStatus.Draft,
            recordFlags: RecordFlag.Auto,
        });
    }

    public makePaymentPosition(): PaymentPosition {
        return Object.assign({
            id: IdGenerator.nextId(),
            payment: null, // this.makePayment()
            paymentId: 0,
            positionId: this.position.id,
            baseSum: 0,
            deductions: 0,
            paySum: 0,
            funds: 0,
            recordFlags: RecordFlag.Auto,
        });
    }
}
