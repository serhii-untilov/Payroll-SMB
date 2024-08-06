import { OmitType, PartialType } from '@nestjs/swagger';
import { Job } from './../entities/job.entity';

export class UpdateJobDto extends PartialType(
    OmitType(Job, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
