import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkNormDto {
    @ApiProperty() id: number;
    @ApiProperty() name: string;
    @ApiProperty() type: string;
    @ApiProperty() dateFrom: Date;
    @ApiProperty() dateTo: Date;
}
