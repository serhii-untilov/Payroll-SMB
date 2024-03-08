import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';
import { WorkSchedule } from './entities/work-schedule.entity';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkSchedule, WorkSchedulePeriod])],
    controllers: [WorkSchedulesController],
    providers: [WorkSchedulesService],
    exports: [WorkSchedulesService],
})
export class WorkSchedulesModule {}
