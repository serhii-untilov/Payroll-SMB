import { TaskType } from '@/types';
import { TaskGenerator } from '../base/task-generator';
import { Context } from '../base/task-generator.context';
import { Task } from './../../../../resources/tasks/entities/task.entity';

export class TaskPostWorkSheet extends TaskGenerator {
    constructor(ctx: Context, type: TaskType) {
        super(ctx, type);
    }

    async getTaskList(): Promise<[Task]> {
        return [this.makeTask()];
    }
}
