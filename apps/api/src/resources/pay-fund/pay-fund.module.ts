import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { CompanyModule } from '../company/company.module';
import { PositionsModule } from '../positions/positions.module';
import { PayFund } from './entities/pay-fund.entity';
import { PayFundController } from './pay-fund.controller';
import { PayFundService } from './pay-fund.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PayFund]),
        forwardRef(() => PositionsModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => UserAccessModule),
    ],
    controllers: [PayFundController],
    providers: [PayFundService],
    exports: [PayFundService],
})
export class PayFundModule {}
