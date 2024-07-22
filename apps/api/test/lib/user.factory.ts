import { User } from './../../src/resources/users/entities/user.entity';
import { incrementalNumber, randPassword, randUser, randUuid } from '@ngneat/falso';

const factory = incrementalNumber();

export const createMockUser = (data?: Partial<User>): User => {
    const user = randUser();
    return {
        id: factory(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: randPassword(),
        refreshToken: randUuid(),
        isActive: true,
        language: '',
        roleId: 1,
        // companies: [],
        createdDate: new Date(),
        updatedDate: new Date(),
        version: 1,
        ...data,
    };
};
