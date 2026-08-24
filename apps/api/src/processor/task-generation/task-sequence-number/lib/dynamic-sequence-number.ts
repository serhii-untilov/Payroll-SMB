import { TaskSequenceNumber } from './../abstract/task-sequence-number';

export class DynamicSequenceNumber extends TaskSequenceNumber {
    private sequenceNumber: number;

    constructor(startSequenceNumber: number) {
        super();
        this.sequenceNumber = startSequenceNumber;
    }

    get() {
        this.sequenceNumber = this.sequenceNumber + 1;
        return this.sequenceNumber;
    }
}
