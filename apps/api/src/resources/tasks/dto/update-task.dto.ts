import { PartialType } from '@nestjs/swagger';
import { Task } from '../entities/task.entity';
import { OmitType } from '@nestjs/swagger';
import { IUpdateTask } from '@repo/shared';

export class UpdateTaskDto
    extends PartialType(
        OmitType(Task, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdateTask {}
