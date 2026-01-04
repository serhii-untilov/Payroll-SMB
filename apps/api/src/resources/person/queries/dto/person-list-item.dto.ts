import { Gender } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export const PERSON_SORTABLE_FIELDS = [
    'firstName',
    'lastName',
    'middleName',
    'fullName',
    'birthDate',
    'taxId',
    'gender',
    'phone',
    'email',
] as const satisfies readonly (keyof PersonListItemDto)[];

export class PersonListItemDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty({ nullable: true })
    middleName: string | null;

    @ApiProperty()
    fullName: string;

    @ApiProperty({ nullable: true, type: String, format: 'date' })
    birthDate: Date | null;

    @ApiProperty({ nullable: true })
    taxId: string | null;

    @ApiProperty({ enum: Gender, nullable: true })
    gender: Gender | null;

    @ApiProperty({ nullable: true })
    phone: string | null;

    @ApiProperty({ nullable: true })
    email: string | null;
}
