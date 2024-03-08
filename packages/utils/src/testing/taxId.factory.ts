import { randNumber } from '@ngneat/falso';

export const createMockTaxId = (): string => {
    return randNumber({ min: 1000000000, max: 9999999999 }).toString();
};
