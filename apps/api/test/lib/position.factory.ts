import { Position } from '@/resources';
import { incrementalNumber } from '@ngneat/falso';
import { createMockUser } from './user.factory';

const factory = incrementalNumber();

export const createMockPosition = (data?: Partial<Position>) => {
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
        personId: null,
        createdDate: currentDate,
        createdUserId: user.id,
        updatedDate: currentDate,
        updatedUserId: user.id,
        version: 1,
        ...data,
    };
};
