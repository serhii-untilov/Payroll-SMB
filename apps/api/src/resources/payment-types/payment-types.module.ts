import { Module } from '@nestjs/common';
import { PaymentTypesService } from './payment-types.service';
import { PaymentTypesController } from './payment-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentType } from './entities/payment-type.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentType]), UsersModule],
    controllers: [PaymentTypesController],
    providers: [PaymentTypesService],
    exports: [PaymentTypesService],
})
export class PaymentTypesModule {}
