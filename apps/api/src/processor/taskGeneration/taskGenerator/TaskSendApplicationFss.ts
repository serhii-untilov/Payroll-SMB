import { getWorkDayBeforeOrEqual } from '@/processor/helpers/workingTime.helper';
import { Task } from '@/resources/tasks/entities/task.entity';
import { TaskType } from '@repo/shared';
import { TaskGenerationService } from '../taskGeneration.service';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskSendApplicationFss extends TaskGenerator {
    constructor(ctx: TaskGenerationService, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<Task[]> {
        const task = this.makeTask();
        task.dateFrom = getWorkDayBeforeOrEqual(this.ctx.payPeriod.dateTo);
        task.dateTo = new Date(task.dateFrom);
        return [task];
    }
}
