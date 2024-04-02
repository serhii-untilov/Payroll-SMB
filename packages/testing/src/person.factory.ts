import { incrementalNumber, randFirstName, randLastName } from '@ngneat/falso';
import { IPerson } from '@repo/shared';
import { createMockUser } from './user.factory';

const factory = incrementalNumber();

export const createMockPerson = (data?: Partial<IPerson>): IPerson => {
    const firstName = randFirstName();
    const lastName = randLastName();
    const middleName = '';
    const user = createMockUser();
    const currentDate = new Date();
    return {
        id: factory(),
        firstName,
        lastName,
        middleName,

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
