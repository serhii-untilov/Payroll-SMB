import { TaskType, monthBegin } from '@repo/shared';
import { TaskListService } from '../task-list.service';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerator } from './abstract/TaskGenerator';
import { add } from 'date-fns';

export class TaskSendIncomeTaxReport extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTask(): Promise<Task | null> {
        const monthNumber = monthBegin(this.ctx.payPeriod.dateFrom).getMonth() + 1;
        if (monthNumber % 3 !== 0) {
            return null;
        }
        const countClosed = await this.ctx.payPeriodsService.countClosed(this.ctx.company.id);
        if (!countClosed) {
            return null;
        }
        const task = this.makeTask();
        task.dateFrom = monthBegin(this.ctx.payPeriod.dateFrom);
        task.dateTo = add(task.dateFrom, { days: 39 });
        return task;
    }
}
