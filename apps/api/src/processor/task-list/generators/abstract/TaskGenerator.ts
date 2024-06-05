import { TaskStatus, TaskType } from '@repo/shared';
import { Task } from '../../../../resources/tasks/entities/task.entity';
import { TaskListService } from './../../task-list.service';

export abstract class TaskGenerator {
    ctx: TaskListService;
    type: TaskType;

    constructor(ctx: TaskListService, type: TaskType) {
        this.ctx = ctx;
        this.type = type;
    }

    public abstract getTask(): Promise<Task | null>;

    public makeTask(): Task {
        return Object.assign({
            companyId: this.ctx.company.id,
            type: this.type,
            dateFrom: this.ctx.payPeriod.dateFrom,
            dateTo: this.ctx.payPeriod.dateTo,
            sequenceNumber: this.ctx.sequenceNumber,
            status: TaskStatus.TODO,
        });
    }
}
