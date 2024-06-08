import { UsersModule } from '../users/users.module';
import { PayPeriodCalcMethod } from './entities/payPeriodCalcMethod.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PayPeriod } from './entities/payPeriod.entity';
import { PayPeriodsController } from './payPeriods.controller';
import { PayPeriodsCalcMethodService } from './payPeriodsCalcMethod.service';
import { PayPeriodsService } from './payPeriods.service';
import { PositionsModule } from '../positions/positions.module';
import { PayFundsModule } from '../pay-funds/pay-funds.module';

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
