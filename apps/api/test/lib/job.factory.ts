import { Job } from '@/resources/jobs/entities/job.entity';
import { incrementalNumber, randJobTitle } from '@ngneat/falso';

const factory = incrementalNumber();

export const createMockJob = (data?: Partial<Job>): Job => {
    const id = factory();
    const name = randJobTitle();
    return {
        id,
        name,
        createdDate: new Date(),
        updatedDate: new Date(),
        version: 1,
        ...data,
    };
};
