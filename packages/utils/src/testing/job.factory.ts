import { incrementalNumber, randJobTitle } from '@ngneat/falso';
import { IJob } from '@repo/shared';

const factory = incrementalNumber();

export const createMockJob = (data?: Partial<IJob>): IJob => {
    const id = factory();
    const name = randJobTitle();
    return {
        id,
        name,
        createdDate: new Date('1970-01-01'),
        createdUserId: 1,
        updatedDate: new Date('1970-01-01'),
        updatedUserId: 1,
        deletedDate: new Date('9999-12-31'),
        version: 1,
        ...data,
    };
};
