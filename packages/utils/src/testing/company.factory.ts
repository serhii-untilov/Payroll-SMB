import { createMockDepartment } from './department.factory';
import { incrementalNumber, randCompanyName } from '@ngneat/falso';
import { ICompany } from '@repo/shared';
import { createMockLaw } from './law.factory';
import { createMockAccounting } from './accounting.factory';
import { createMockUser } from './user.factory';
import { monthBeg } from '../utils/date';
import { createMockTaxId } from './taxId.factory';

const factory = incrementalNumber();

export const createMockCompany = (data?: Partial<ICompany>): ICompany => {
    const law = createMockLaw();
    const accounting = createMockAccounting();
    const user = createMockUser();
    const department = createMockDepartment();
    const currentDate = new Date();
    return {
        id: factory(),
        name: randCompanyName(),

        dateFrom: new Date('1970-01-01'),
        dateTo: new Date('9999-12-31'),

        law: law,
        lawId: law.id,

        taxId: createMockTaxId(),

        accounting: accounting,
        accountingId: accounting.id,

        payPeriod: monthBeg(currentDate),
        checkDate: monthBeg(currentDate),

        departments: [department],

        createdDate: currentDate,
        createdUserId: user.id,
        updatedDate: currentDate,
        updatedUserId: user.id,
        deletedDate: new Date('9999-12-31'),
        version: 1,
        ...data,
    };
};
