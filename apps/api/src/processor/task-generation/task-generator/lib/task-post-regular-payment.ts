import { Task } from './../../../../resources/tasks/entities/task.entity';
import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { CalcMethod, PaymentStatus, TaskStatus, TaskType } from '@/types';
import { TaskGenerationService } from '../../task-generator.service';
import { TaskGenerator } from '../abstract/task-generator';

export class TaskPostRegularPayment extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo);
        task.dateTo = task.dateFrom;
        const count = (
            await this.ctx.paymentsService.findAll({
                companyId: this.ctx.company.id,
                accPeriod: this.ctx.payPeriod.dateFrom,
                status: PaymentStatus.Draft,
                relations: true,
            })
        ).filter((o) => o.paymentType?.calcMethod === CalcMethod.RegularPayment).length;
        task.status = count ? TaskStatus.Todo : TaskStatus.Done;
        return [task];
    }
}
