import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { TaskType } from '@/types';
import { monthBegin } from '@repo/shared';
import { add } from 'date-fns';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';
import { Task } from './../../../../resources/tasks/entities/task.entity';

export class TaskSendIncomeTaxReport extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const monthNumber = monthBegin(this.ctx.payPeriod.dateFrom).getMonth() + 1;
        if (monthNumber % 3 !== 0) {
            return [];
        }
        const countClosed = await this.ctx.payPeriodService.countClosed(this.ctx.company.id);
        if (!countClosed) {
            return [];
        }
        const task = this.makeTask();
        task.dateFrom = monthBegin(this.ctx.payPeriod.dateFrom);
        task.dateTo = getWorkDayBeforeOrEqual(add(task.dateFrom, { days: 39 }));
        return [task];
    }
}
