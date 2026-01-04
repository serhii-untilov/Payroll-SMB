import { Task } from './../../../../resources/tasks/entities/task.entity';
import { TaskStatus, TaskType } from '@/types';
import { TaskGenerationService } from '../../task-generator.service';
import { TaskGenerator } from '../abstract/task-generator';

export class TaskCreateCompany extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        const count = await this.ctx.userCompaniesService.count(this.ctx.userId, this.ctx.company.id);
        task.status = count ? TaskStatus.Done : TaskStatus.Todo;
        if (count) {
            const countClosed = await this.ctx.payPeriodsService.countClosed(this.ctx.company.id);
            if (countClosed) {
                return [];
            }
        }
        return [task];
    }
}
