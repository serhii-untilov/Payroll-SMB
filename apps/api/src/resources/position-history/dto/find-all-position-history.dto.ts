import { CreatePositionHistoryDto } from './create-position-history.dto';
export class FindAllPositionHistoryDto extends CreatePositionHistoryDto {
    onDate?: Date;
    onPayPeriodDate?: Date;
    last?: boolean;
    relations?: boolean;
}
