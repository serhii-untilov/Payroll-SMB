import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
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
        forwardRef(() => UserAccessModule),
    ],
    controllers: [PayFundsController],
    providers: [PayFundsService],
    exports: [PayFundsService],
})
export class PayFundsModule {}
