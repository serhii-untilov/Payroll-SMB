import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskStatus, TaskType } from '@/types';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';

export class TaskFillPositionList extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        const countEmployees = await this.ctx.positionsService.countEmployees(this.ctx.company.id);
        task.status = countEmployees ? TaskStatus.Done : TaskStatus.Todo;
        if (countEmployees) {
            const countClosed = await this.ctx.payPeriodService.countClosed(this.ctx.company.id);
            if (countClosed) {
                return [];
            }
        }
        return [task];
    }
}
