import { ApiProperty } from '@nestjs/swagger';
import { IAuth } from '@repo/shared';

export class AuthDto implements IAuth {
    @ApiProperty() email: string;
    @ApiProperty() password: string;
    @ApiProperty() rememberMe: boolean;
}
