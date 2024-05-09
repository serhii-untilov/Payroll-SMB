import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PayPeriod } from './entities/pay-period.entity';
import { PayPeriodsController } from './pay-periods.controller';
import { PayPeriodsService } from './pay-periods.service';

@Module({
    imports: [TypeOrmModule.forFeature([PayPeriod]), CompaniesModule, AccessModule],
    controllers: [PayPeriodsController],
    providers: [PayPeriodsService],
    exports: [PayPeriodsService],
})
export class PayPeriodsModule {}
