import { PartialType, PickType } from '@nestjs/swagger';
import { PayPeriod } from './../entities/pay-period.entity';

export class FindAllPayPeriodDto extends PartialType(
    PickType(PayPeriod, ['companyId', 'dateFrom', 'dateTo']), // All Partial !!!
) {
    relations?: boolean;
    fullFieldList?: boolean;
}
