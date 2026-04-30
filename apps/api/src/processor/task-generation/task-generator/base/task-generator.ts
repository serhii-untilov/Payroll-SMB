import { getWorkDayBeforeOrEqual } from '@/processor/helpers';
import { Task } from '@/resources/tasks/entities/task.entity';
import { IdGenerator } from '@/snowflake/snowflake.singleton';
import { TaskStatus, TaskType } from '@/types';
import { Context } from './task-generator.context';

export abstract class TaskGenerator {
    ctx: Context;
    type: TaskType;

    constructor(ctx: Context, type: TaskType) {
        this.ctx = ctx;
        this.type = type;
    }

    public abstract getTaskList(): Promise<Task[]>;

    public makeTask(): Task {
        const task = Object.assign({
            id: IdGenerator.nextId(),
            companyId: this.ctx.company.id,
            type: this.type,
            dateFrom: new Date(this.ctx.payPeriod.dateFrom),
            dateTo: getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo),
            status: TaskStatus.Todo,
        });
        task.sequenceNumber = this.ctx.sequenceNumber.get(task);
        return task;
    }
}
