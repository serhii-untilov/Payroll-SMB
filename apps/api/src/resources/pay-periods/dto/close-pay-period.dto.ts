import { PickType } from '@nestjs/swagger';
import { PayPeriod } from '../entities/pay-period.entity';

export class ClosePayPeriodDto extends PickType(PayPeriod, ['version']) {}
