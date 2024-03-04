import { Module } from '@nestjs/common';
import { WorkSchedulePeriodsService } from './work-schedule-periods.service';
import { WorkSchedulePeriodsController } from './work-schedule-periods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkSchedulePeriod } from './entities/work-schedule-period.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([WorkSchedulePeriod]), UsersModule],
    controllers: [WorkSchedulePeriodsController],
    providers: [WorkSchedulePeriodsService],
    exports: [WorkSchedulePeriodsService],
})
export class WorkSchedulePeriodsModule {}
