import { PayFund, PayFundType, PayPeriod } from '@/resources';
import { PayFundCalculationService } from '../../pay-fund-calculation.service';

export abstract class PayFundCalc {
    ctx: PayFundCalculationService;
    accPeriod: PayPeriod;
    payFundType: PayFundType;
    current: PayFund[];

    constructor(
        ctx: PayFundCalculationService,
        accPeriod: PayPeriod,
        payFundType: PayFundType,
        current: PayFund[],
    ) {
        this.ctx = ctx;
        this.accPeriod = accPeriod;
        this.payFundType = payFundType;
        this.current = current;
    }

    abstract calculate(): PayFund;
}
