import { ApiProperty } from '@nestjs/swagger';
export class CreateWorkNormPeriodDto {
    @ApiProperty() id: number;
    @ApiProperty() workNormId: number;
    @ApiProperty() day: number;
    @ApiProperty() hours: number;
}
