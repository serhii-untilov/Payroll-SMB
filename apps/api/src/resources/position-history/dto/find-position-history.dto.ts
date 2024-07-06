import { ApiProperty } from '@nestjs/swagger';
import { IFindPositionHistory } from '@repo/shared';

export class FindPositionHistoryDto implements IFindPositionHistory {
    @ApiProperty() positionId: number;
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
}
