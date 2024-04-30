import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessModule } from '../access/access.module';
import { PositionsModule } from './../positions/positions.module';
import { UsersModule } from './../users/users.module';
import { PositionHistory } from './entities/position-history.entity';
import { PositionHistoryController } from './position-history.controller';
import { PositionHistoryService } from './position-history.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PositionHistory]),
        UsersModule,
        PositionsModule,
        AccessModule,
    ],
    controllers: [PositionHistoryController],
    providers: [PositionHistoryService],
})
export class PositionHistoryModule {}
