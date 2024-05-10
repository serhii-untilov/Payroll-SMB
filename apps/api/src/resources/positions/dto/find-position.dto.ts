import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Position } from '../entities/position.entity';
import { IFindPosition } from '@repo/shared';

export class FindPositionDto extends PartialType(Position) implements IFindPosition {
    @ApiProperty() companyId: number;
    @ApiProperty() onDate?: Date;
    @ApiProperty() onPayPeriodDate?: Date;
    @ApiProperty() relations?: boolean;
    @ApiProperty() vacanciesOnly?: boolean;
    @ApiProperty() dismissedOnly?: boolean;
    @ApiProperty() deletedOnly?: boolean;
    @ApiProperty() includeDeleted?: boolean;
}
