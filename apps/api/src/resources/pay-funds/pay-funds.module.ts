import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompanyModule } from '../company/company.module';
import { PositionsModule } from '../positions/positions.module';
import { PayFund } from './entities/pay-fund.entity';
import { PayFundsController } from './pay-funds.controller';
import { PayFundsService } from './pay-funds.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayFund]),
        forwardRef(() => PositionsModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => AccessModule),
    ],
    controllers: [PayFundsController],
    providers: [PayFundsService],
    exports: [PayFundsService],
})
export class PayFundsModule {}
