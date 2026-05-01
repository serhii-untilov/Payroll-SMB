import { PartialType } from '@nestjs/swagger';
import { CreateWorkTimeNormDto } from './create-work-time-norm.dto';

export class UpdateWorkTimeNormDto extends PartialType(CreateWorkTimeNormDto) {}
