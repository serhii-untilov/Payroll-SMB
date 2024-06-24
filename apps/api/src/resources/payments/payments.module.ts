import { Module, forwardRef } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PositionsModule } from '../positions/positions.module';
import { CompaniesModule } from '../companies/companies.module';
import { AccessModule } from '../access/access.module';
import { PaymentPositionsService } from './payment-positions.service';
import { PaymentDeductionsService } from './payment-deductions.service';
import { PaymentFundsService } from './payment-funds.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment]),
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
