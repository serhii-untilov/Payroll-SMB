import { getAdvancePaymentDate, payFundPayPeriodFactSum, payPeriodFactSum } from '@/processor/helpers';
import { Position } from '@/resources/positions/entities';
import { PaymentGroup } from '@/types';
import { dateUTC } from '@repo/shared';
import { CalcPayment, PaymentContext } from '../base/calc-payment.abstract';
import { PaymentPosition } from './../../../../resources/payment-position/entities/paymentPosition.entity';
import { PaymentType } from './../../../../resources/payment-type/entities/payment-type.entity';

export class CalcAdvance extends CalcPayment {
    rate: number;

    constructor(ctx: PaymentContext, position: Position, paymentType: PaymentType, current: PaymentPosition[]) {
        super(ctx, position, paymentType, current);
        this.rate = 0.5;
    }

    public calculate(): PaymentPosition {
        const paymentPosition = this.makePaymentPosition();
        paymentPosition.payment = this.makePayment();
        paymentPosition.payment.dateFrom = getAdvancePaymentDate(this.ctx.payPeriod);
        paymentPosition.payment.dateTo = dateUTC(paymentPosition.payment.dateFrom);
        paymentPosition.baseSum = this.calcBaseSum();
        paymentPosition.deductions = this.calcDeductions();
        paymentPosition.funds = this.calcFunds();
        paymentPosition.paySum = this.calcPaySum(paymentPosition);
        return paymentPosition;
    }

    private calcBaseSum(): number {
        const factSum = payPeriodFactSum(this.ctx.payPeriod, this.ctx.payrolls, this.getBaseSumPaymentTypeIds());
        // TODO
        return Math.max(0, Math.trunc(factSum * this.rate));
    }

    private calcDeductions(): number {
        const factSum = payPeriodFactSum(this.ctx.payPeriod, this.ctx.payrolls, this.getDeductionsPaymentTypeIds());
        // TODO
        return Math.max(0, Math.trunc(factSum * this.rate));
    }

    private calcFunds(): number {
        const funds = payFundPayPeriodFactSum(this.ctx.payPeriod, this.ctx.payFunds);
        // TODO
        return Math.max(0, Math.trunc(funds * this.rate));
    }

    private calcPaySum(paymentPosition: PaymentPosition): number {
        return paymentPosition.baseSum - paymentPosition.deductions;
    }

    private getBaseSumPaymentTypeIds(): string[] {
        // TODO: Replace to Entry Table
        const paymentGroups: string[] = [PaymentGroup.Basic, PaymentGroup.Adjustments];
        return this.ctx.paymentTypes.filter((o) => paymentGroups.includes(o.paymentGroup)).map((o) => o.id);
    }

    private getDeductionsPaymentTypeIds(): string[] {
        // TODO: Replace to Entry Table
        const paymentGroups: string[] = [PaymentGroup.Taxes];
        return this.ctx.paymentTypes.filter((o) => paymentGroups.includes(o.paymentGroup)).map((o) => o.id);
    }
}
