import { incrementalNumber } from '@ngneat/falso';
import { IPayPeriod, PayPeriodState } from '@repo/shared';

const factory = incrementalNumber();

export const createMockPayPeriod = (data?: Partial<IPayPeriod>): IPayPeriod => {
    const id = factory();

    return {
        id,
        companyId: 1,
        state: PayPeriodState.CURRENT,
        ...data,
    };
};
