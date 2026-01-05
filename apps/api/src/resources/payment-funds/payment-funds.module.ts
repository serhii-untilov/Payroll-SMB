import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { PaymentPositionsModule } from '../payment-positions';
import { PaymentsModule } from '../payments';
import { PaymentFund } from './entities/payment-fund.entity';
import { PaymentFundsController } from './payment-funds.controller';
import { PaymentFundsService } from './payment-funds.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentFund]),
        forwardRef(() => UserAccessModule),
        forwardRef(() => PaymentsModule),
        forwardRef(() => PaymentPositionsModule),
    ],
    controllers: [PaymentFundsController],
    providers: [PaymentFundsService],
    exports: [PaymentFundsService],
})
export class PaymentFundsModule {}
