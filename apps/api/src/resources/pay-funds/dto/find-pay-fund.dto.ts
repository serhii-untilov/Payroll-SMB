import { ApiProperty } from '@nestjs/swagger';

export class FindPayFundDto {
    @ApiProperty() companyId?: number;
    @ApiProperty() positionId?: number;
    @ApiProperty() payPeriod?: Date;
    @ApiProperty() relations?: boolean;
}
