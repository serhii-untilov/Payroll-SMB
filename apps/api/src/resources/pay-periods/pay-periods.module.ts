import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PayFundsModule } from '../pay-funds/pay-funds.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PositionsModule } from '../positions/positions.module';
import { UsersModule } from '../users/users.module';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodCalcMethod } from './entities/pay-period-calc-method.entity';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';
import { PayPeriodsCalcMethodService } from './pay-periods-calc-method.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayPeriod, PayPeriodCalcMethod]),
        forwardRef(() => AccessModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PayFundsModule),
        forwardRef(() => UsersModule),
    ],
    controllers: [PayPeriodsController],
    providers: [PayPeriodsService, PayPeriodsCalcMethodService],
    exports: [PayPeriodsService, PayPeriodsCalcMethodService],
})
export class PayPeriodsModule {}
