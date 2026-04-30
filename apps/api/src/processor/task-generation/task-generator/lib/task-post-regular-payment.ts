import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { CalcMethod, PaymentStatus, TaskStatus, TaskType } from '@/types';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';
import { Task } from './../../../../resources/tasks/entities/task.entity';

export class TaskPostRegularPayment extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        if (!this.count()) {
            return [];
        }
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo);
        task.dateTo = task.dateFrom;
        task.status = this.countDraft() ? TaskStatus.Todo : TaskStatus.Done;
        return [task];
    }

    countDraft() {
        return this.ctx.payments.filter(
            (o) => o.paymentType?.calcMethod === CalcMethod.RegularPayment && o.status === PaymentStatus.Draft,
        ).length;
    }

    count() {
        return this.ctx.payments.filter((o) => o.paymentType?.calcMethod === CalcMethod.RegularPayment).length;
    }
}
