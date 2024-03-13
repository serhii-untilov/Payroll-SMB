import { createMockDepartment } from './department.factory';
import { incrementalNumber, randCompanyName } from '@ngneat/falso';
import { ICompany } from '@repo/shared';
import { createMockLaw } from './law.factory';
import { createMockAccounting } from './accounting.factory';
import { createMockUser } from './user.factory';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/utils';
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

        dateFrom: minDate(),
        dateTo: maxDate(),

        law: law,
        lawId: law.id,

        taxId: createMockTaxId(),

        accounting: accounting,
        accountingId: accounting.id,

        payPeriod: monthBegin(currentDate),
        checkDate: monthEnd(currentDate),

        departments: [department],

        createdDate: currentDate,
        createdUserId: user.id,
        updatedDate: currentDate,
        updatedUserId: user.id,
        deletedDate: undefined,
        deletedUserId: undefined,
        version: 1,
        ...data,
    };
};
