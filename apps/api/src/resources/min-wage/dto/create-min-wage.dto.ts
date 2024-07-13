import { ApiProperty } from '@nestjs/swagger';
export class CreateMinWageDto {
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() paySum: number;
}
