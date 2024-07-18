import { Task } from '@/resources';
import { TaskSequenceNumber } from './../abstract/task-sequence-number';

export class DynamicSequenceNumber extends TaskSequenceNumber {
    private sequenceNumber: number;

    constructor(startSequenceNumber: number) {
        super();
        this.sequenceNumber = startSequenceNumber;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get(task: Task) {
        this.sequenceNumber = this.sequenceNumber + 1;
        return this.sequenceNumber;
    }
}
