import { incrementalNumber, randRole } from '@ngneat/falso';
import { IRole } from '@repo/shared';

const factory = incrementalNumber();

export const createMockRole = (data?: Partial<IRole>): IRole => {
    const id = factory();
    const name = randRole();
    return {
        id,
        name,
        users: [],
        ...data,
    };
};
