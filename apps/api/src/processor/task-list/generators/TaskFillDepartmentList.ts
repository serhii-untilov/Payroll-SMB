import { TaskStatus, TaskType } from '@repo/shared';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskListService } from '../task-list.service';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskFillDepartmentList extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        const count = await this.ctx.departmentsService.count(this.ctx.company.id);
        task.status = count ? TaskStatus.DONE : TaskStatus.TODO;
        if (count) {
            const countClosed = await this.ctx.payPeriodsService.countClosed(this.ctx.company.id);
            if (countClosed) {
                return null;
            }
        }
        return [task];
    }
}
