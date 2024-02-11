import { IAuth } from '@repo/shared';

export class AuthDto implements IAuth {
    name: string;
    password: string;
}
