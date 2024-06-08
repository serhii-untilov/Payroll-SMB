import { PaymentSchedule, TaskType, monthBegin } from '@repo/shared';
import { add } from 'date-fns';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerationService } from '../taskGeneration.service';
import { getWorkDayBeforeOrEqual } from '../../helpers/workingTime.helper';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskPostAdvancePayment extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        if (this.ctx.company.paymentSchedule == PaymentSchedule.EVERY_15_DAY) {
            return [];
        }
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(
            add(monthBegin(this.ctx.payPeriod.dateFrom), { days: 14 }),
        );
        task.dateTo = new Date(task.dateFrom);
        return [task];
    }
}
