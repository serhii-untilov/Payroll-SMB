import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPositionHistory } from '@repo/shared';
import { CreatePositionHistoryDto } from './create-position-history.dto';

export class FindPositionHistoryDto
    extends PartialType(CreatePositionHistoryDto)
    implements IFindPositionHistory
{
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
}
