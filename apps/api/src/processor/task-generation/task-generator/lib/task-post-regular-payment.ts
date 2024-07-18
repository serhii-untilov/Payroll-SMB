import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { Task } from '@/resources';
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
                status: PaymentStatus.DRAFT,
                relations: true,
            })
        ).filter((o) => o.paymentType?.calcMethod === CalcMethod.REGULAR_PAYMENT).length;
        task.status = count ? TaskStatus.TODO : TaskStatus.DONE;
        return [task];
    }
}
