import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access/user-access.module';
import { PayrollsModule } from '../payrolls/payrolls.module';
import { PaymentPosition } from './entities/paymentPosition.entity';
import { PaymentPositionController } from './payment-position.controller';
import { PaymentPositionService } from './payment-position.service';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentPosition]), forwardRef(() => UserAccessModule), forwardRef(() => PayrollsModule)],
    controllers: [PaymentPositionController],
    providers: [PaymentPositionService],
    exports: [PaymentPositionService],
})
export class PaymentPositionModule {}
