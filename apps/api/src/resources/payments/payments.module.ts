import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { CompanyModule } from '../company';
import { PayPeriodModule } from '../pay-period';
import { PaymentPositionModule } from '../payment-position';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PositionsModule } from '../positions/positions.module';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment]),
        forwardRef(() => UserAccessModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => PaymentPositionModule),
        forwardRef(() => PayPeriodModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PositionsModule),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule {}
