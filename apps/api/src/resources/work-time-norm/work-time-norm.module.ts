import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccessModule } from '../user-access';
import { WorkTimeNormDay } from './entities/work-time-norm-day.entity';
import { WorkTimeNorm } from './entities/work-time-norm.entity';
import { WorkTimeNormController } from './work-time-norm.controller';
import { WorkTimeNormService } from './work-time-norm.service';

@Module({
    imports: [TypeOrmModule.forFeature([WorkTimeNorm, WorkTimeNormDay]), forwardRef(() => UserAccessModule)],
    controllers: [WorkTimeNormController],
    providers: [WorkTimeNormService],
    exports: [WorkTimeNormService],
})
export class WorkTimeNormModule {}
