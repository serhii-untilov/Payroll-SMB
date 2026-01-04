import { BaseMapper } from '@/resources/common/mapper/base.mapper';
import { CreatePersonDto } from '../commands/dto/create-person.dto';
import { UpdatePersonDto } from '../commands/dto/update-person.dto';
import { PersonEntity } from '../entities/person.entity';
import { PersonListItemDto } from '../queries/dto/person-list-item.dto';
import { PersonReadDto } from '../queries/dto/person-read.dto';

export class PersonMapper extends BaseMapper<
    PersonEntity,
    PersonReadDto,
    CreatePersonDto,
    UpdatePersonDto,
    PersonListItemDto
> {
    constructor() {
        super(PersonEntity);
    }

    toReadDto(entity: PersonEntity): PersonReadDto {
        return {
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            middleName: entity.middleName,
            fullName: PersonMapper.buildFullName(entity.firstName, entity.lastName, entity.middleName),
            birthDate: entity.birthDate,
            taxId: entity.taxId,
            gender: entity.gender,
            phone: entity.phone,
            email: entity.email,
            version: entity.version,
        };
    }

    toListItemDto(entity: PersonEntity): PersonListItemDto {
        return this.toReadDto(entity);
    }

    static buildFullName(lastName: string, firstName: string, middleName?: string | null): string {
        return [lastName, firstName, middleName].filter(Boolean).join(' ');
    }
}
