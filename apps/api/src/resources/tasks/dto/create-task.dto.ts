import { OmitType } from '@nestjs/swagger';
import { Task } from './../entities/task.entity';

export class CreateTaskDto extends OmitType(Task, [
    'id',
    'company',
    'transform',
    'createdDate',
    'createdUserId',
    'updatedDate',
    'updatedUserId',
    'deletedDate',
    'deletedUserId',
    'version',
    'generateId',
]) {}
