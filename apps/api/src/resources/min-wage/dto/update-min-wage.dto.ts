import { PartialType } from '@nestjs/swagger';
import { CreateMinWageDto } from './create-min-wage.dto';

export class UpdateMinWageDto extends PartialType(CreateMinWageDto) {
    version: number;
}
