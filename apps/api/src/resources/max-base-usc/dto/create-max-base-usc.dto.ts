import { ApiProperty } from '@nestjs/swagger';
import { ICreateMaxBaseUSC } from '@repo/shared';

export class CreateMaxBaseUscDto implements ICreateMaxBaseUSC {
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() paySum: number;
}
