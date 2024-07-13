import { ITokens } from '@repo/shared';

export class TokensDto implements ITokens {
    accessToken: string;
    refreshToken: string | null;
}
