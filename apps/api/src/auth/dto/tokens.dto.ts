import { ITokens } from '@/types';

export class TokensDto implements ITokens {
    accessToken: string;
    refreshToken: string | null;
}
