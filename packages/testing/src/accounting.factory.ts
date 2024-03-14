import { incrementalNumber, randCountry } from '@ngneat/falso';
import { IAccounting, AccountingType } from '@repo/shared';

const factory = incrementalNumber();

export const createMockAccounting = (data?: Partial<IAccounting>): IAccounting => {
    return {
        id: factory(),
        name: randCountry(),
        type: AccountingType.GENERIC,
        ...data,
    };
};
