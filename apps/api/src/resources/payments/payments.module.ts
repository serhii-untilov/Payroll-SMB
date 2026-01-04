import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access';
import { CompanyModule } from '../company';
import { PayPeriodsModule } from '../pay-periods';
import { PaymentPositionsModule } from '../payment-positions';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PositionsModule } from '../positions/positions.module';
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment]),
        forwardRef(() => AccessModule),
        forwardRef(() => CompanyModule),
        forwardRef(() => PaymentPositionsModule),
        forwardRef(() => PayPeriodsModule),
        forwardRef(() => PayrollsModule),
        forwardRef(() => PositionsModule),
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
    exports: [PaymentsService],
})
export class PaymentsModule {}
