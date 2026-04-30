import { getAdvancePaymentDate } from '@/processor/helpers';
import { CalcMethod, PaymentSchedule, PaymentStatus, TaskStatus, TaskType } from '@/types';
import { dateUTC } from '@repo/shared';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';
import { Task } from '@/resources/tasks/entities/task.entity';

export class TaskPostAdvancePayment extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        if (this.ctx.company.paymentSchedule == PaymentSchedule.Every15day) {
            return [];
        }
        if (!this.count()) {
            return [];
        }
        const task = this.makeTask();
        task.dateFrom = getAdvancePaymentDate(this.ctx.payPeriod);
        task.dateTo = dateUTC(task.dateFrom);
        task.status = this.countDraft() ? TaskStatus.Todo : TaskStatus.Done;
        return [task];
    }

    countDraft() {
        return this.ctx.payments.filter(
            (o) => o.paymentType?.calcMethod === CalcMethod.AdvancedPayment && o.status === PaymentStatus.Draft,
        ).length;
    }

    count() {
        return this.ctx.payments.filter((o) => o.paymentType?.calcMethod === CalcMethod.AdvancedPayment).length;
    }
}
