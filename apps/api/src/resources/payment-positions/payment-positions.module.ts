import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PositionsModule } from '../positions/positions.module';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionsController } from './payment-positions.controller';
import { PaymentPositionsService } from './payment-positions.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentPosition]),
        forwardRef(() => PositionsModule),
        forwardRef(() => AccessModule),
        forwardRef(() => PayrollsModule),
    ],
    controllers: [PaymentPositionsController],
    providers: [PaymentPositionsService],
    exports: [PaymentPositionsService],
})
export class PaymentPositionsModule {}
