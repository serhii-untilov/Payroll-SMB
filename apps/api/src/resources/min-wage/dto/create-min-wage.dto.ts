import { ApiProperty } from '@nestjs/swagger';
import { ICreateMinWage } from '@repo/shared';

export class CreateMinWageDto implements ICreateMinWage {
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() paySum: number;
}
