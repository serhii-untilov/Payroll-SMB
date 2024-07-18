import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { Task } from '@/resources';
import { TaskType } from '@/types';
import { monthBegin } from '@repo/shared';
import { add } from 'date-fns';
import { TaskGenerationService } from '../../task-generator.service';
import { TaskGenerator } from '../abstract/task-generator';

export class TaskSendIncomeTaxReport extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const monthNumber = monthBegin(this.ctx.payPeriod.dateFrom).getMonth() + 1;
        if (monthNumber % 3 !== 0) {
            return [];
        }
        const countClosed = await this.ctx.payPeriodsService.countClosed(this.ctx.company.id);
        if (!countClosed) {
            return [];
        }
        const task = this.makeTask();
        task.dateFrom = monthBegin(this.ctx.payPeriod.dateFrom);
        task.dateTo = getWorkDayBeforeOrEqual(add(task.dateFrom, { days: 39 }));
        return [task];
    }
}
