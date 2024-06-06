import { TaskType } from '@repo/shared';
import { TaskListService } from '../task-list.service';
import { Task } from '../../../resources/tasks/entities/task.entity';
import { TaskGenerator } from './abstract/TaskGenerator';

export class TaskSendApplicationFss extends TaskGenerator {
    constructor(ctx: TaskListService, type: TaskType) {
        super(ctx, type);
    }

    async getTask(): Promise<Task | null> {
        return this.makeTask();
    }
}
