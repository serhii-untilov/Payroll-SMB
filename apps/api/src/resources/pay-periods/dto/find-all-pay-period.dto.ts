import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { PayPeriod } from './../entities/pay-period.entity';

export class FindAllPayPeriodDto extends IntersectionType(
    PickType(PayPeriod, ['companyId']),
    PartialType(PickType(PayPeriod, ['dateFrom', 'dateTo'])),
) {
    relations?: boolean;
    fullFieldList?: boolean;
}
