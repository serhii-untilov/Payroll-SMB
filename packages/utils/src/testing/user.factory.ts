import { incrementalNumber, randPassword, randUser, randUuid } from '@ngneat/falso';
import { IUser } from '@repo/shared';

const factory = incrementalNumber();

export const createMockUser = (data?: Partial<IUser>): IUser => {
    const user = randUser();
    return {
        id: factory(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: randPassword(),
        refreshToken: randUuid(),
        isActive: true,
        language: undefined,
        roles: [],
        ...data,
    };
};
