import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { PaymentPositionModule } from '../payment-position/payment-position.module';
import { PaymentsModule } from '../payments/payments.module';
import { PaymentDeduction } from './entities/payment-deduction.entity';
import { PaymentDeductionController } from './payment-deduction.controller';
import { PaymentDeductionService } from './payment-deduction.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentDeduction]),
        forwardRef(() => PaymentsModule),
        forwardRef(() => UserAccessModule),
        forwardRef(() => PaymentPositionModule),
    ],
    controllers: [PaymentDeductionController],
    providers: [PaymentDeductionService],
    exports: [PaymentDeductionService],
})
export class PaymentDeductionModule {}
