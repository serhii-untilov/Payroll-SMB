import { incrementalNumber, randEmail, randPassword } from '@ngneat/falso';
import { IUser } from '@repo/shared';

const factory = incrementalNumber();

export const createMockUser = (data?: Partial<IUser>): IUser => {
    const id = factory();
    const email = randEmail();
    const password = randPassword();
    return {
        id,
        name: email,
        email,
        password,
        isActive: true,
        ...data,
    };
};
