import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserAccessModule } from '../user-access';
import { PayPeriodModule } from '../pay-period/pay-period.module';

@Module({
    imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => UserAccessModule), forwardRef(() => PayPeriodModule)],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
