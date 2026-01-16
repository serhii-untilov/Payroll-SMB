import { BaseMapper } from '@/resources/common/mapper/base.mapper';
import { JobReadDto } from '../dto/job-read.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { JobEntity } from '../entities/job.entity';
import { JobListItemDto } from '../dto/job-list-item.dto';
import { CreateJobDto } from '../dto/create-job.dto';

export class JobMapper extends BaseMapper<JobEntity, JobReadDto, CreateJobDto, UpdateJobDto, JobListItemDto> {
    constructor() {
        super(JobEntity);
    }

    toReadDto(entity: JobEntity): JobReadDto {
        return {
            id: entity.id,
            name: entity.name,
            version: entity.version,
        };
    }

    toListItemDto(entity: JobEntity): JobListItemDto {
        return this.toReadDto(entity);
    }
}
