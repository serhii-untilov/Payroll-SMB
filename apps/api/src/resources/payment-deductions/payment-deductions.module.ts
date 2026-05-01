import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { PaymentPositionModule } from '../payment-position';
import { PaymentDeduction } from './entities/payment-deduction.entity';
import { PaymentDeductionsController } from './payment-deductions.controller';
import { PaymentDeductionsService } from './payment-deductions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentDeduction]),
        forwardRef(() => PaymentsModule),
        forwardRef(() => UserAccessModule),
        forwardRef(() => PaymentPositionModule),
    ],
    controllers: [PaymentDeductionsController],
    providers: [PaymentDeductionsService],
    exports: [PaymentDeductionsService],
})
export class PaymentsModule {}
