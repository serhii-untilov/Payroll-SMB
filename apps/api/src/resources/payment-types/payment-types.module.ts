import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypesController } from './payment-types.controller';
import { PaymentTypesService } from './payment-types.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentType]), forwardRef(() => UserAccessModule)],
    controllers: [PaymentTypesController],
    providers: [PaymentTypesService],
    exports: [PaymentTypesService],
})
export class PaymentTypesModule {}
