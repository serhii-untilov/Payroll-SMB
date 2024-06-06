import { TaskStatus, TaskType } from '@repo/shared';
import { TaskListService } from '../task-list.service';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskFillDepartmentList extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTask(): Promise<Task | null> {
        const task = this.makeTask();
        const count = await this.ctx.departmentsService.count(this.ctx.company.id);
        task.status = count ? TaskStatus.DONE : TaskStatus.TODO;
        if (count) {
            const countClosed = await this.ctx.payPeriodsService.countClosed(this.ctx.company.id);
            if (countClosed) {
                return null;
            }
        }
        return task;
    }
}
