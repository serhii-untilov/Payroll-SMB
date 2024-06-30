import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PositionsModule } from '../positions/positions.module';
import { Payment } from './entities/payment.entity';
import { PaymentDeduction } from './entities/paymentDeduction.entity';
import { PaymentFund } from './entities/paymentFund.entity';
import { PaymentPosition } from './payment-positions/entities/paymentPosition.entity';
import { PaymentDeductionsService } from './payment-deductions/payment-deductions.service';
import { PaymentFundsService } from './payment-funds/payment-funds.service';
import { PaymentPositionsService } from './payment-positions/payment-positions.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { PaymentPositionsController } from './payment-positions/payment-positions.controller';
import { PaymentDeductionsController } from './payment-deductions/payment-deductions.controller';
import { PaymentFundsController } from './payment-funds/payment-funds.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, PaymentPosition, PaymentDeduction, PaymentFund]),
        forwardRef(() => PositionsModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => AccessModule),
    ],
    controllers: [
        PaymentsController,
        PaymentPositionsController,
        PaymentDeductionsController,
        PaymentFundsController,
    ],
    providers: [
        PaymentsService,
        PaymentPositionsService,
        PaymentDeductionsService,
        PaymentFundsService,
    ],
    exports: [
        PaymentsService,
        PaymentPositionsService,
        PaymentDeductionsService,
        PaymentFundsService,
    ],
})
export class PaymentsModule {}
