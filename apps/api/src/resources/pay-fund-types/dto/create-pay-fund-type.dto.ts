import { PayFundType } from './../entities/pay-fund-type.entity';
import { OmitType } from '@nestjs/swagger';

export class CreatePayFundTypeDto extends OmitType(PayFundType, [
    'id',
    'createdDate',
    'createdUserId',
    'updatedDate',
    'updatedUserId',
    'deletedDate',
    'deletedUserId',
    'version',
]) {}
