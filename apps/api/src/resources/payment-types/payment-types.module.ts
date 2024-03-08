import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypesController } from './payment-types.controller';
import { PaymentTypesService } from './payment-types.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentType])],
    controllers: [PaymentTypesController],
    providers: [PaymentTypesService],
    exports: [PaymentTypesService],
})
export class PaymentTypesModule {}
