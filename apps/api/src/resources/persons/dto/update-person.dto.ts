import { OmitType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { IUpdatePerson } from '@repo/shared';
import { Person } from '../entities/person.entity';

export class UpdatePersonDto
    extends PartialType(
        OmitType(Person, [
            'id',
            'createdDate',
            'createdUserId',
            'updatedDate',
            'updatedUserId',
            'deletedDate',
            'deletedUserId',
        ]),
    )
    implements IUpdatePerson {}
