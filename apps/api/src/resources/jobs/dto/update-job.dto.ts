import { PartialType } from '@nestjs/mapped-types';
import { IUpdateJob } from '@repo/shared';
import { CreateJobDto } from './create-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) implements IUpdateJob {}
