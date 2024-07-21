import { Person } from './../../src/resources/persons/entities/person.entity';
import { incrementalNumber, randFirstName, randLastName } from '@ngneat/falso';
import { dateUTC } from '@repo/shared';

const factory = incrementalNumber();

export const createMockPerson = (data?: Partial<Person>) => {
    const firstName = randFirstName();
    const lastName = randLastName();
    const middleName = '';
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
        updatedDate: currentDate,
        version: 1,
        ...data,
    };
};
