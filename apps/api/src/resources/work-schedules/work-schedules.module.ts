import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkNormPeriod } from './entities/work-schedule-period.entity';
import { WorkNorm } from './entities/work-schedule.entity';
import { WorkNormsController } from './work-schedules.controller';
import { WorkNormsService } from './work-schedules.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkNorm, WorkNormPeriod])],
    controllers: [WorkNormsController],
    providers: [WorkNormsService],
    exports: [WorkNormsService],
})
export class WorkNormsModule {}
