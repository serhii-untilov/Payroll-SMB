import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobEntity } from './entities/job.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { UserAccessModule } from '../user-access';

@Module({
    imports: [TypeOrmModule.forFeature([JobEntity]), forwardRef(() => UserAccessModule)],
    controllers: [JobController],
    providers: [JobService],
    exports: [JobService],
})
export class JobModule {}
