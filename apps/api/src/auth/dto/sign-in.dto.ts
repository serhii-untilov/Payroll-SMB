import { ISignIn } from '@repo/shared';

export class SignInDto implements ISignIn {
    name: string;
    password: string;
}
