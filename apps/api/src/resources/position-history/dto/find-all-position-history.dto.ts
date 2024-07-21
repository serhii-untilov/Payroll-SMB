import { PickType } from '@nestjs/swagger';
import { PositionHistory } from '../entities/position-history.entity';
export class FindAllPositionHistoryDto extends PickType(PositionHistory, ['positionId']) {
    onDate?: Date;
    onPayPeriodDate?: Date;
    last?: boolean;
    relations?: boolean;
}
