import { ApiProperty } from '@nestjs/swagger';

export class FindPositionHistoryDto {
    @ApiProperty() positionId: number;
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
}
