import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IFindPayFund } from '@repo/shared';
import { PayFund } from '../entities/pay-fund.entity';
import { OmitType } from '@nestjs/mapped-types';

export class FindPayFundDto
    extends PartialType(OmitType(PayFund, ['transform']))
    implements IFindPayFund
{
    @ApiProperty() companyId?: number;
    @ApiProperty() relations?: boolean;
}
