import { OmitType, PartialType } from '@nestjs/swagger';
import { Task } from './../entities/task.entity';

export class UpdateTaskDto extends PartialType(
    OmitType(Task, [
        'id',
        'company',
        'transform',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
