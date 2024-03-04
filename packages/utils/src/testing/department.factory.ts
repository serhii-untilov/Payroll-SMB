import { incrementalNumber, randDepartment } from '@ngneat/falso';
import { IDepartment } from '@repo/shared';

const factory = incrementalNumber();

export const createMockDepartment = (data?: Partial<IDepartment>): IDepartment => {
    const id = factory();
    const name = randDepartment();
    return {
        id,
        name,
        companyId: undefined,
        dateFrom: new Date('1970-01-01'),
        dateTo: new Date('9999-12-31'),
        parent: undefined,
        createdDate: new Date('1970-01-01'),
        createdUserId: undefined,
        updatedDate: new Date('1970-01-01'),
        updatedUserId: undefined,
        deletedDate: new Date('9999-12-31'),
        version: 1,
        ...data,
    };
};
