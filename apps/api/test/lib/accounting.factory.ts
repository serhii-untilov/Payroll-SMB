import { Accounting } from '@/resources/accounting/entities/accounting.entity';
import { AccountingType } from '@/types';
import { incrementalNumber, randCountry } from '@ngneat/falso';

const factory = incrementalNumber();

export const createMockAccounting = (data?: Partial<Accounting>): Accounting => {
    return {
        id: factory(),
        name: randCountry(),
        type: AccountingType.GENERIC,
        createdDate: new Date(),
        updatedDate: new Date(),
        version: 1,
        ...data,
    };
};
