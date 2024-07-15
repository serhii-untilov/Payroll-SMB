import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Person } from '../entities/person.entity';
import { CreatePersonDto } from './create-person.dto';

export class UpdatePersonDto extends IntersectionType(
    PickType(Person, ['version']),
    PartialType(CreatePersonDto),
) {}
