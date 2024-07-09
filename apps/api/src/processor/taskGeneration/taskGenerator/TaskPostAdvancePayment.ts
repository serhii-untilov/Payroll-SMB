import { getAdvancePaymentDate } from '@/processor/helpers/payment.helper';
import { Task } from '@/resources/tasks/entities/task.entity';
import {
    CalcMethod,
    PaymentSchedule,
    PaymentStatus,
    TaskStatus,
    TaskType,
    dateUTC,
} from '@repo/shared';
import { TaskGenerationService } from '../taskGeneration.service';
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
        task.dateFrom = getAdvancePaymentDate(this.ctx.payPeriod);
        task.dateTo = dateUTC(task.dateFrom);
        const count = (
            await this.ctx.paymentsService.findAll({
                companyId: this.ctx.company.id,
                accPeriod: this.ctx.payPeriod.dateFrom,
                status: PaymentStatus.DRAFT,
                relations: true,
            })
        ).filter((o) => o.paymentType?.calcMethod === CalcMethod.ADVANCE_PAYMENT).length;
        task.status = count ? TaskStatus.TODO : TaskStatus.DONE;
        return [task];
    }
}
