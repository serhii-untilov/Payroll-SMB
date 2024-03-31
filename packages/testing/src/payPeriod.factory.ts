import { incrementalNumber } from '@ngneat/falso';
import { IPayPeriod, PayPeriodState } from '@repo/shared';
import { maxDate, minDate } from '@repo/utils';

const factory = incrementalNumber();

export const createMockPayPeriod = (data?: Partial<IPayPeriod>): IPayPeriod => {
    const id = factory();

    return {
        id,
        companyId: 1,
        dateFrom: minDate(),
        dateTo: maxDate(),
        state: PayPeriodState.OPENED,
        ...data,
    };
};
