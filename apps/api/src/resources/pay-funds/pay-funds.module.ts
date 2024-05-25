import { Module, forwardRef } from '@nestjs/common';
import { PayFundsService } from './pay-funds.service';
import { PayFundsController } from './pay-funds.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayFund } from './entities/pay-fund.entity';
import { PositionsModule } from '../positions/positions.module';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayFund]),
        forwardRef(() => PositionsModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => AccessModule),
    ],
    controllers: [PayFundsController],
    providers: [PayFundsService],
    exports: [PayFundsService],
})
export class PayFundsModule {}
