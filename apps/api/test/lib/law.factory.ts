import { Law } from '@/resources';
import { LawType } from '@/types';
import { incrementalNumber, randCountry } from '@ngneat/falso';

const factory = incrementalNumber();

export const createMockLaw = (data?: Partial<Law>): Law => {
    const id = factory();
    const name = randCountry();
    return {
        id,
        name,
        type: LawType.UKRAINE,
        ...data,
    };
};
