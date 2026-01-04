import { CreatePersonDto } from '../commands/dto/create-person.dto';
import { UpdatePersonDto } from '../commands/dto/update-person.dto';
import { PersonEntity } from '../entities/person.entity';
import { PersonListItemDto } from '../queries/dto/person-list-item.dto';
import { PersonReadDto } from '../queries/dto/person-read.dto';

export class PersonMapper {
    static toEntity(dto: CreatePersonDto | UpdatePersonDto): PersonEntity {
        const entity = new PersonEntity();
        Object.assign(entity, dto);

        // entity.fullName = PersonMapper.buildFullName(dto.lastName, dto.firstName, dto.middleName);

        return entity;
    }

    static fromEntity(entity: PersonEntity): PersonReadDto {
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

    static diff(
        before: PersonEntity,
        dto: UpdatePersonDto | CreatePersonDto | PersonReadDto,
    ): Record<string, { before: unknown; after: unknown }> {
        const diff: Record<string, { before: unknown; after: unknown }> = {};

        for (const [key, after] of Object.entries(dto)) {
            if (after === undefined) continue;

            const beforeValue = (before as any)[key];

            if (beforeValue !== after) {
                diff[key] = {
                    before: beforeValue,
                    after,
                };
            }
        }

        return diff;
    }

    static updateEntity(entity: PersonEntity, dto: UpdatePersonDto): PersonEntity {
        Object.assign(entity, dto);

        // if (dto.firstName || dto.lastName || dto.middleName !== undefined) {
        //     entity.fullName = PersonMapper.buildFullName(entity.lastName, entity.firstName, entity.middleName);
        // }

        return entity;
    }

    static toPartial(dto: UpdatePersonDto): Partial<PersonEntity> {
        const partial: Partial<PersonEntity> = {};

        if (dto.firstName !== undefined) {
            partial.firstName = dto.firstName;
        }

        if (dto.lastName !== undefined) {
            partial.lastName = dto.lastName;
        }

        if (dto.middleName !== undefined) {
            partial.middleName = dto.middleName;
        }

        if (dto.birthDate !== undefined) {
            partial.birthDate = dto.birthDate;
        }

        if (dto.gender !== undefined) {
            partial.gender = dto.gender;
        }

        // add other mutable fields here

        return partial;
    }

    static toResponse(entity: PersonEntity): PersonReadDto {
        return { ...entity };
    }

    static toListItem(entity: PersonEntity): PersonListItemDto {
        return {
            id: entity.id,
            firstName: entity.firstName,
            lastName: entity.lastName,
            middleName: entity.middleName,
            fullName: entity.fullName,
            birthDate: entity.birthDate,
            taxId: entity.taxId,
            gender: entity.gender,
            phone: entity.phone,
            email: entity.email,
        };
    }

    static buildFullName(lastName: string, firstName: string, middleName?: string | null): string {
        return [lastName, firstName, middleName].filter(Boolean).join(' ');
    }
}
