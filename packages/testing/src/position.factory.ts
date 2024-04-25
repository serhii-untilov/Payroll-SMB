import { incrementalNumber } from '@ngneat/falso';
import { IPosition } from '@repo/shared';
import { createMockUser } from './user.factory';

const factory = incrementalNumber();

export const createMockPosition = (data?: Partial<IPosition>): IPosition => {
    const user = createMockUser();
    const currentDate = new Date();
    return {
        id: factory(),

        companyId: 1,

        cardNumber: factory().toString(), // Identity number (Табельний номер)
        sequenceNumber: factory(), // Sequence in payroll reports to place managers on top
        description: '',

        dateFrom: new Date(), // Hire date or date of open vacancy
        dateTo: new Date(), // Dismissal date or date of close vacancy

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
