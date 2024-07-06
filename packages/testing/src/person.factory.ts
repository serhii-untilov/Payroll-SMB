import { incrementalNumber, randFirstName, randLastName } from '@ngneat/falso';
import { IPerson, dateUTC } from '@repo/shared';
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
        fullName: `${firstName} ${lastName}`,
        birthday: dateUTC(new Date('1970-01-01')),
        taxId: '',
        sex: '',
        phone: '',
        email: '',
        photo: '',
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
