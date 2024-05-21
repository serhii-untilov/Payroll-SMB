import { PayPeriodCalcMethod } from './entities/pay-period-calc-method.entity';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';
import { PositionsModule } from '../positions/positions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayPeriod, PayPeriodCalcMethod]),
        forwardRef(() => AccessModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => PositionsModule),
        forwardRef(() => PayrollsModule),
    ],
    controllers: [PayPeriodsController],
    providers: [PayPeriodsService],
    exports: [PayPeriodsService],
})
export class PayPeriodsModule {}
