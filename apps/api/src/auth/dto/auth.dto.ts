import { IAuth, ITokens } from '@repo/shared';

export class AuthDto implements IAuth {
    name: string;
    password: string;
}

export class TokensDto implements ITokens {
    accessToken: string;
    refreshToken: string;
}
