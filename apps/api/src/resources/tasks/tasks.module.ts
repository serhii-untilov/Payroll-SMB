import { Module, forwardRef } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { AccessModule } from '../access/access.module';
import { PayPeriodsModule } from '../pay-periods/pay-periods.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task]),
        forwardRef(() => AccessModule),
        forwardRef(() => PayPeriodsModule),
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService],
})
export class TasksModule {}
