import { Task } from './../../../../resources/tasks/entities/task.entity';

export abstract class TaskSequenceNumber {
    abstract get(task: Task);
}
