import { IAuth } from '@repo/shared';

export class AuthDto implements IAuth {
    email: string;
    password: string;
    rememberMe: boolean;
}
