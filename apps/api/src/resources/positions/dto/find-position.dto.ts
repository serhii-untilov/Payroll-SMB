import { PartialType } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';

export class FindPositionDto extends PartialType(Position) {
    companyId: number;
    onDate?: Date;
    onPayPeriodDate?: Date;
    relations?: boolean;
    employeesOnly?: boolean;
    vacanciesOnly?: boolean;
    dismissedOnly?: boolean;
    deletedOnly?: boolean;
    includeDeleted?: boolean;
}
