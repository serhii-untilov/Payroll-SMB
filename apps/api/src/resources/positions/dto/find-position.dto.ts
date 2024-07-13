import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';

export class FindPositionDto extends PartialType(Position) {
    @ApiProperty() companyId: number;
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
    @ApiProperty() employeesOnly?: boolean;
    @ApiProperty() vacanciesOnly?: boolean;
    @ApiProperty() dismissedOnly?: boolean;
    @ApiProperty() deletedOnly?: boolean;
    @ApiProperty() includeDeleted?: boolean;
}
