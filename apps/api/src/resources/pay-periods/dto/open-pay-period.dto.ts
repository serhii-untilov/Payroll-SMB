import { PickType } from '@nestjs/swagger';
import { PayPeriod } from '../entities/pay-period.entity';

export class OpenPayPeriodDto extends PickType(PayPeriod, ['version']) {}
