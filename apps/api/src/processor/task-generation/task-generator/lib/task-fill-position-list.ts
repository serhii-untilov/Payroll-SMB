import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskStatus, TaskType } from '@/types';
import { TaskGenerationService } from '../../task-generator.service';
import { TaskGenerator } from '../abstract/task-generator';

export class TaskFillPositionList extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        const countEmployees = await this.ctx.positionsService.countEmployees(this.ctx.company.id);
        task.status = countEmployees ? TaskStatus.DONE : TaskStatus.TODO;
        if (countEmployees) {
            const countClosed = await this.ctx.payPeriodsService.countClosed(this.ctx.company.id);
            if (countClosed) {
                return [];
            }
        }
        return [task];
    }
}
