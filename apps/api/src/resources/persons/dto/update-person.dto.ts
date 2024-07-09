import { OmitType, PartialType } from '@nestjs/swagger';
import { Person } from '../entities/person.entity';

export class UpdatePersonDto extends PartialType(
    OmitType(Person, [
        'id',
        'createdDate',
        'createdUserId',
        'updatedDate',
        'updatedUserId',
        'deletedDate',
        'deletedUserId',
    ]),
) {}
