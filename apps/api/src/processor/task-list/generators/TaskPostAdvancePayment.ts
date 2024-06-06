import { PaymentSchedule, TaskType, monthBegin } from '@repo/shared';
import { add } from 'date-fns';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskListService } from '../task-list.service';
import { getWorkDayBeforeOrEqual } from './../../../processor/helpers/workingTime';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskPostAdvancePayment extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTask(): Promise<Task | null> {
        if (this.ctx.company.paymentSchedule == PaymentSchedule.EVERY_15_DAY) {
            return null;
        }
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(
            add(monthBegin(this.ctx.payPeriod.dateFrom), { days: 14 }),
        );
        task.dateTo = task.dateFrom;
        return task;
    }
}
