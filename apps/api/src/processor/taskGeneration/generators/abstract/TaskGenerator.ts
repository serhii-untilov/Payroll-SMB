import { TaskStatus, TaskType } from '@repo/shared';
import { Task } from '../../../../resources/tasks/entities/task.entity';
import { TaskGenerationService } from '../../taskGeneration.service';
import { getWorkDayBeforeOrEqual } from '../../../helpers/workingTime.helper';

export abstract class TaskGenerator {
    ctx: TaskGenerationService;
    type: TaskType;

    constructor(ctx: TaskGenerationService, type: TaskType) {
        this.ctx = ctx;
        this.type = type;
    }

    public abstract getTaskList(): Promise<Task[]>;

    public makeTask(): Task {
        return Object.assign({
            id: this.ctx.id,
            companyId: this.ctx.company.id,
            type: this.type,
            dateFrom: new Date(this.ctx.payPeriod.dateFrom),
            dateTo: getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo),
            sequenceNumber: this.ctx.sequenceNumber,
            status: TaskStatus.TODO,
        });
    }
}
