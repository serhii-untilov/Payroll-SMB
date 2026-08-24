import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypeController } from './payment-type.controller';
import { PaymentTypeService } from './payment-type.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentType]), forwardRef(() => UserAccessModule)],
    controllers: [PaymentTypeController],
    providers: [PaymentTypeService],
    exports: [PaymentTypeService],
})
export class PaymentTypeModule {}
