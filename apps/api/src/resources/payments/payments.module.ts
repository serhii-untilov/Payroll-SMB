import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { CompaniesModule } from '../companies/companies.module';
import { PositionsModule } from '../positions/positions.module';
import { Payment } from './entities/payment.entity';
import { PaymentDeduction } from './entities/paymentDeduction.entity';
import { PaymentFund } from './entities/paymentFund.entity';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentDeductionsService } from './payment-deductions.service';
import { PaymentFundsService } from './payment-funds.service';
import { PaymentPositionsService } from './payment-positions.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment, PaymentPosition, PaymentDeduction, PaymentFund]),
        forwardRef(() => PositionsModule),
        forwardRef(() => CompaniesModule),
        forwardRef(() => AccessModule),
    ],
    controllers: [PaymentsController],
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
