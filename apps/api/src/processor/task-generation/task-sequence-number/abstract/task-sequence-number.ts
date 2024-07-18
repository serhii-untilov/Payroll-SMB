import { Task } from '@/resources';

export abstract class TaskSequenceNumber {
    abstract get(task: Task);
}
