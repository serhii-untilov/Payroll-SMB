import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Person } from './../entities/person.entity';

export class FindAllPersonDto extends IntersectionType(
    PartialType(
        PickType(Person, [
            'firstName',
            'lastName',
            'middleName',
            'birthday',
            'sex',
            'taxId',
            'email',
        ]),
    ),
) {}
