import { incrementalNumber, randCountry } from '@ngneat/falso';
import { ILaw } from '@repo/shared';

const factory = incrementalNumber();

export const createMockLaw = (data?: Partial<ILaw>): ILaw => {
    const id = factory();
    const name = randCountry();
    return {
        id,
        name,
        ...data,
    };
};
