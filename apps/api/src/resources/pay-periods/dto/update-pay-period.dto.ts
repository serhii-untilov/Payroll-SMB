import { PartialType } from '@nestjs/swagger';
import { CreatePayPeriodDto } from './create-pay-period.dto';

export class UpdatePayPeriodDto extends PartialType(CreatePayPeriodDto) {}
