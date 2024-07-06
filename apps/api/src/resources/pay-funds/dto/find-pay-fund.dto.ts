import { ApiProperty } from '@nestjs/swagger';
import { IFindPayFund } from '@repo/shared';

export class FindPayFundDto implements IFindPayFund {
    @ApiProperty() companyId?: number;
    @ApiProperty() positionId?: number;
    @ApiProperty() payPeriod?: Date;
    @ApiProperty() relations?: boolean;
}
