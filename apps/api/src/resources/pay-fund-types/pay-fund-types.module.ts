import { Module } from '@nestjs/common';
import { FundTypesController } from './pay-fund-types.controller';
import { FundTypesService } from './pay-fund-types.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayFundType } from './entities/pay-fund-type.entity';
import { AccessModule } from '../access/access.module';

@Module({
    imports: [TypeOrmModule.forFeature([PayFundType]), AccessModule],
    controllers: [FundTypesController],
    providers: [FundTypesService],
})
export class FundTypesModule {}
