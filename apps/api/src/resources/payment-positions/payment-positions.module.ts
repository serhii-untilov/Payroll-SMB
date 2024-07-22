import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PaymentsModule } from '../payments';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionsController } from './payment-positions.controller';
import { PaymentPositionsService } from './payment-positions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentPosition]),
        forwardRef(() => AccessModule),
        forwardRef(() => PaymentsModule),
        forwardRef(() => PayrollsModule),
    ],
    controllers: [PaymentPositionsController],
    providers: [PaymentPositionsService],
    exports: [PaymentPositionsService],
})
export class PaymentPositionsModule {}
