import { PayPeriod } from './../../../../resources/pay-periods/entities/pay-period.entity';
import { PayFundType } from './../../../../resources/pay-fund-types/entities/pay-fund-type.entity';
import { PayFund } from './../../../../resources/pay-funds/entities/pay-fund.entity';
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
