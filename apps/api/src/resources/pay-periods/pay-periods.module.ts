import { PayPeriodPaymentGroup } from './entities/pay-period-payment-group.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';
import { PayrollsModule } from '../payrolls/payrolls.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayPeriod, PayPeriodPaymentGroup]),
        forwardRef(() => CompaniesModule),
        forwardRef(() => AccessModule),
        forwardRef(() => PayrollsModule),
    ],
    controllers: [PayPeriodsController],
    providers: [PayPeriodsService],
    exports: [PayPeriodsService],
})
export class PayPeriodsModule {}
