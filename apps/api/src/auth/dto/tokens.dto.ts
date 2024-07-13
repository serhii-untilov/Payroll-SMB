import { ApiProperty } from '@nestjs/swagger';
import { ITokens } from '@repo/shared';

export class TokensDto implements ITokens {
    @ApiProperty() accessToken: string;
    @ApiProperty() refreshToken: string | null;
}
