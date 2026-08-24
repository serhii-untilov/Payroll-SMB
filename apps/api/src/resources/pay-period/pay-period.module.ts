import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { CompanyModule } from '../company/company.module';
import { PayFundModule } from '../pay-fund/pay-fund.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PositionsModule } from '../positions/positions.module';
import { UserModule } from '../user/user.module';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodSummary } from './entities/pay-period-summary.entity';
import { PayPeriodController } from './pay-period.controller';
import { PayPeriodService } from './pay-period.service';
import { PayPeriodCalcMethodService } from './pay-period-calc-method.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayPeriod, PayPeriodSummary]),
        forwardRef(() => UserAccessModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayFundModule),
        forwardRef(() => UserModule),
    ],
    controllers: [PayPeriodController],
    providers: [PayPeriodService, PayPeriodCalcMethodService],
    exports: [PayPeriodService, PayPeriodCalcMethodService],
})
export class PayPeriodModule {}
