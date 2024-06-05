import { TaskType } from '@repo/shared';
import { TaskListService } from '../task-list.service';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskClosePayPeriod extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTask(): Promise<Task | null> {
        const task = this.makeTask();
        task.dateFrom = this.ctx.payPeriod.dateTo;
        task.dateTo = this.ctx.payPeriod.dateTo;
        return task;
    }
}
