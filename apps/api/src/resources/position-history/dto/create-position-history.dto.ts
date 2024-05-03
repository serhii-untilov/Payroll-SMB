import { ApiProperty } from '@nestjs/swagger';
import { ICreatePositionHistory } from '@repo/shared';

export class CreatePositionHistoryDto implements ICreatePositionHistory {
    @ApiProperty() positionId: number;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
    @ApiProperty() departmentId?: number | null;
    @ApiProperty() jobId: number | null;
    @ApiProperty() workNormId: number;
    @ApiProperty() paymentTypeId: number;
    @ApiProperty() wage: number;
    @ApiProperty() rate: number;
}
