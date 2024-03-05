import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { WorkSchedule } from './entities/work-schedule.entity';
import { WorkSchedulesController } from './work-schedules.controller';
import { WorkSchedulesService } from './work-schedules.service';
import { WorkSchedulePeriodsController } from './work-schedule-periods.controller';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WorkSchedule, WorkSchedulePeriod]), UsersModule],
    controllers: [WorkSchedulesController, WorkSchedulePeriodsController],
    providers: [WorkSchedulesService, WorkSchedulePeriodsService],
    exports: [WorkSchedulesService, WorkSchedulePeriodsService],
})
export class WorkSchedulesModule {}
