import { AccountingType } from '@/types';
import { incrementalNumber, randCountry } from '@ngneat/falso';
import { Accounting } from './../../src/resources/accounting/entities/accounting.entity';

const factory = incrementalNumber();

export const createMockAccounting = (data?: Partial<Accounting>): Accounting => {
    return {
        id: factory(),
        name: randCountry(),
        type: AccountingType.Generic,
        createdDate: new Date(),
        updatedDate: new Date(),
        version: 1,
        ...data,
    };
};
