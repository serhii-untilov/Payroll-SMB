import { Department } from './../../src/resources/departments/entities/department.entity';
import { incrementalNumber, randDepartment } from '@ngneat/falso';
import { maxDate, minDate } from '@repo/shared';

const factory = incrementalNumber();

export const createMockDepartment = (data?: Partial<Department>) => {
    const id = factory();
    const name = randDepartment();
    return {
        id,
        name,
        companyId: 1,
        dateFrom: minDate(),
        dateTo: maxDate(),
        createdDate: new Date(),
        updatedDate: new Date(),
        version: 1,
        ...data,
    };
};
