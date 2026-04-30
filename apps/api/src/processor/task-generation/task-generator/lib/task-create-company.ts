import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskStatus, TaskType } from '@/types';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';

export class TaskCreateCompany extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        const count = await this.ctx.userRoleService.count(this.ctx.userId, this.ctx.company.id);
        task.status = count ? TaskStatus.Done : TaskStatus.Todo;
        if (count) {
            const countClosed = await this.ctx.payPeriodService.countClosed(this.ctx.company.id);
            if (countClosed) {
                return [];
            }
        }
        return [task];
    }
}
