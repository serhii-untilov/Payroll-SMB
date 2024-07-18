import { createMockDepartment } from './department.factory';
import { incrementalNumber, randCompanyName } from '@ngneat/falso';
import { createMockLaw } from './law.factory';
import { createMockAccounting } from './accounting.factory';
import { createMockUser } from './user.factory';
import { maxDate, minDate, monthBegin, monthEnd } from '@repo/shared';
import { createMockTaxId } from './taxId.factory';
import { Company } from '@/resources/companies/entities/company.entity';
import { PaymentSchedule } from '@/types';

const factory = incrementalNumber();

export const createMockCompany = (data?: Partial<Company>) => {
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
        paymentSchedule: PaymentSchedule.LAST_DAY,
        payPeriod: monthBegin(currentDate),
        checkDate: monthEnd(currentDate),
        departments: [department],
        createdDate: currentDate,
        createdUserId: user.id,
        updatedDate: currentDate,
        updatedUserId: user.id,
        version: 1,
        ...data,
    };
};
