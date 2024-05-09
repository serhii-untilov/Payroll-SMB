import { ApiProperty } from '@nestjs/swagger';
import { ICreateWorkNormPeriod } from '@repo/shared';
export class CreateWorkNormPeriodDto implements ICreateWorkNormPeriod {
    @ApiProperty() id: number;
    @ApiProperty() workNormId: number;
    @ApiProperty() day: number;
    @ApiProperty() hours: number;
}
