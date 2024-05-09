import { ApiProperty } from '@nestjs/swagger';
import { ICreateWorkNorm } from '@repo/shared';

export class CreateWorkNormDto implements ICreateWorkNorm {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty() type: string;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
}
