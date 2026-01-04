import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PayPeriodsModule } from '../pay-periods/pay-periods.module';
import { PositionsModule } from './../positions/positions.module';
import { PositionHistory } from './entities/position-history.entity';
import { PositionHistoryController } from './position-history.controller';
import { PositionHistoryService } from './position-history.service';

@Module({
    imports: [TypeOrmModule.forFeature([PositionHistory]), PositionsModule, PayPeriodsModule, AccessModule],
    controllers: [PositionHistoryController],
    providers: [PositionHistoryService],
    exports: [PositionHistoryService],
})
export class PositionHistoryModule {}
