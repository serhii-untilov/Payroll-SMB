import { Role } from '@/resources';
import { RoleType } from '@/types';
import { incrementalNumber, randRole } from '@ngneat/falso';

const factory = incrementalNumber();

export const createMockRole = (data?: Partial<Role>): Role => {
    const id = factory();
    const name = randRole();
    return {
        id,
        name,
        type: RoleType.GUEST,
        ...data,
    };
};
