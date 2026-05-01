import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { PaymentPositionModule } from '../payment-position';
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
export class PaymentsModule {}
