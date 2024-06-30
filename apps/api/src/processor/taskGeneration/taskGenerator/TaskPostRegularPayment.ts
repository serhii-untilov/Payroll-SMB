import { CalcMethod, PaymentStatus, TaskStatus, TaskType } from '@repo/shared';
import { TaskGenerationService } from '../taskGeneration.service';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerator } from './abstract/TaskGenerator';
import { getWorkDayBeforeOrEqual } from '../../helpers/workingTime.helper';

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
        ).filter((o) => o.paymentType.calcMethod === CalcMethod.REGULAR_PAYMENT).length;
        task.status = count ? TaskStatus.TODO : TaskStatus.DONE;
        return [task];
    }
}
