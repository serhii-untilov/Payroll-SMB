import { OmitType, PartialType } from '@nestjs/swagger';
import { IUpdatePayFundType } from '@repo/shared';
import { PayFundType } from '../entities/pay-fund-type.entity';

export class UpdatePayFundTypeDto
    extends PartialType(
        OmitType(PayFundType, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePayFundType {}
