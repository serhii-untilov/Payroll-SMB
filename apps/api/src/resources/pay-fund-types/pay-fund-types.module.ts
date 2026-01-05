import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { PayFundType } from './entities/pay-fund-type.entity';
import { PayFundTypesController } from './pay-fund-types.controller';
import { PayFundTypesService } from './pay-fund-types.service';

@Module({
    imports: [TypeOrmModule.forFeature([PayFundType]), forwardRef(() => UserAccessModule)],
    controllers: [PayFundTypesController],
    providers: [PayFundTypesService],
    exports: [PayFundTypesService],
})
export class PayFundTypesModule {}
