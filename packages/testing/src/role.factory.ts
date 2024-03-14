import { incrementalNumber, randRole } from '@ngneat/falso';
import { IRole, RoleType } from '@repo/shared';

const factory = incrementalNumber();

export const createMockRole = (data?: Partial<IRole>): IRole => {
    const id = factory();
    const name = randRole();
    return {
        id,
        name,
        type: RoleType.GUEST,
        // users: [],
        ...data,
    };
};
