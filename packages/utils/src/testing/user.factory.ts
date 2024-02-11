import { incrementalNumber, randEmail, randPassword, randUuid } from '@ngneat/falso';
import { IUser } from '@repo/shared';

const factory = incrementalNumber();

export const createMockUser = (data?: Partial<IUser>): IUser => {
    const email = randEmail();
    return {
        id: factory(),
        name: email,
        email,
        password: randPassword(),
        refreshToken: randUuid(),
        isActive: true,
        roles: [],
        ...data,
    };
};
