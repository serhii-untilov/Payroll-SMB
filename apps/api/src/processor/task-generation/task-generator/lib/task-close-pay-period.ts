import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskType } from '@/types';
import { TaskGenerationService } from '../../task-generator.service';
import { TaskGenerator } from '../abstract/task-generator';

export class TaskClosePayPeriod extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo);
        task.dateTo = new Date(task.dateFrom);
        return [task];
    }
}
