import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionController } from './payment-position.controller';
import { PaymentPositionService } from './payment-position.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentPosition])],
    controllers: [PaymentPositionController],
    providers: [PaymentPositionService],
    exports: [PaymentPositionService],
})
export class PaymentPositionModule {}
