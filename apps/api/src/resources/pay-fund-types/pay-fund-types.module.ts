import { Module } from '@nestjs/common';
import { PayFundTypesController } from './pay-fund-types.controller';
import { PayFundTypesService } from './pay-fund-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayFundType } from './entities/pay-fund-type.entity';
import { AccessModule } from '../access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([PayFundType]), AccessModule],
    controllers: [PayFundTypesController],
    providers: [PayFundTypesService],
    exports: [PayFundTypesService],
})
export class PayFundTypesModule {}
