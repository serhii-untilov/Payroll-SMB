import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { PayPeriodsModule } from '../pay-periods/pay-periods.module';
import { PositionsModule } from './../positions/positions.module';
import { PositionHistory } from './entities/position-history.entity';
import { PositionHistoryController } from './position-history.controller';
import { PositionHistoryService } from './position-history.service';

@Module({
    imports: [TypeOrmModule.forFeature([PositionHistory]), PositionsModule, PayPeriodsModule, UserAccessModule],
    controllers: [PositionHistoryController],
    providers: [PositionHistoryService],
    exports: [PositionHistoryService],
})
export class PositionHistoryModule {}
