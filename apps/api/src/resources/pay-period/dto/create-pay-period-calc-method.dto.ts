import { OmitType } from '@nestjs/swagger';
import { PayPeriodSummary } from '../entities/pay-period-summary.entity';

export class CreatePayPeriodSummaryDto extends OmitType(PayPeriodSummary, ['id', 'payPeriod', 'transform']) {}
