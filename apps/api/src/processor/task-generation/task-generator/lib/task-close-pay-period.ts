import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { TaskType } from '@/types';
import { TaskGenerator } from '../base/task-generator';
import { Task } from '@/resources/tasks/entities/task.entity';
import { Context } from '../base/task-generator.context';

export class TaskClosePayPeriod extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo);
        task.dateTo = new Date(task.dateFrom);
        return [task];
    }
}
