import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Person } from './../entities/person.entity';

export class CreatePersonDto extends IntersectionType(
    PickType(Person, ['firstName', 'lastName']),
    PartialType(
        OmitType(Person, [
            'id',
            'positions',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
            'version',
        ]),
    ),
) {}
