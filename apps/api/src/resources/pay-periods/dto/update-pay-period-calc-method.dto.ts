import { PartialType } from '@nestjs/swagger';
import { CreatePayPeriodSummaryDto } from './create-pay-period-calc-method.dto';

export class UpdatePayPeriodSummaryDto extends PartialType(CreatePayPeriodSummaryDto) {}
