import { PaymentSchedule, TaskType } from '@repo/shared';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerationService } from '../taskGeneration.service';
import { getAdvancePaymentDate } from './../../helpers/payment.helper';
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
        task.dateFrom = getAdvancePaymentDate(this.ctx.payPeriod.dateFrom);
        task.dateTo = new Date(task.dateFrom);
        return [task];
    }
}
