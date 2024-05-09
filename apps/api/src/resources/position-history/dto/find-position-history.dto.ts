import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPositionHistory } from '@repo/shared';
import { PositionHistory } from '../entities/position-history.entity';

export class FindPositionHistoryDto
    extends PartialType(PositionHistory)
    implements IFindPositionHistory
{
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
}
