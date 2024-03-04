import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WorkSchedule } from './entities/work-schedule.entity';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkSchedule]), UsersModule],
    controllers: [WorkSchedulesController],
    providers: [WorkSchedulesService],
    exports: [WorkSchedulesService],
})
export class WorkSchedulesModule {}
