import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { CompanyModule } from '../company/company.module';
import { PayFundsModule } from '../pay-funds/pay-funds.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PositionsModule } from '../positions/positions.module';
import { UserModule } from '../user/user.module';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodSummary } from './entities/pay-period-summary.entity';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';
import { PayPeriodsCalcMethodService } from './pay-periods-calc-method.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayPeriod, PayPeriodSummary]),
        forwardRef(() => UserAccessModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayFundsModule),
        forwardRef(() => UserModule),
    ],
    controllers: [PayPeriodsController],
    providers: [PayPeriodsService, PayPeriodsCalcMethodService],
    exports: [PayPeriodsService, PayPeriodsCalcMethodService],
})
export class PayPeriodsModule {}
