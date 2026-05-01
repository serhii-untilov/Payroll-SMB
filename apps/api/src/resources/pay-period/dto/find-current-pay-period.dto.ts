import { PartialType, PickType } from '@nestjs/swagger';
import { PayPeriod } from './../entities/pay-period.entity';

export class FindCurrentPayPeriodDto extends PartialType(PickType(PayPeriod, ['companyId'])) {
    relations?: boolean;
    fullFieldList?: boolean;
}
