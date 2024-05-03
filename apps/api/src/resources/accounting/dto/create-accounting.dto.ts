import { ApiProperty } from '@nestjs/swagger';
import { ICreateAccounting } from '@repo/shared';

export class CreateAccountingDto implements ICreateAccounting {
    @ApiProperty()
    name: string;

    @ApiProperty()
    type: string;
}
