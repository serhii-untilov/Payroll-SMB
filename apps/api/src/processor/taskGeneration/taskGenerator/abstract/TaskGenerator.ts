import { getWorkDayBeforeOrEqual } from '@/processor/helpers/workingTime.helper';
import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskStatus, TaskType } from '@repo/shared';
import { TaskGenerationService } from './../../taskGeneration.service';

export abstract class TaskGenerator {
    ctx: TaskGenerationService;
    type: TaskType;

    constructor(ctx: TaskGenerationService, type: TaskType) {
        this.ctx = ctx;
        this.type = type;
    }

    public abstract getTaskList(): Promise<Task[]>;

    public makeTask(): Task {
        const task = Object.assign({
            id: this.ctx.id,
            companyId: this.ctx.company.id,
            type: this.type,
            dateFrom: new Date(this.ctx.payPeriod.dateFrom),
            dateTo: getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo),
            status: TaskStatus.TODO,
        });
        task.sequenceNumber = this.ctx.sequenceNumber.get(task);
        return task;
    }
}
