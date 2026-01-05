import { Gender } from '@/types';
import { ApiProperty } from '@nestjs/swagger';

export const PERSON_SORTING_MAP = {
    firstName: 'firstName',
    lastName: 'lastName',
    middleName: 'middleName',
    fullName: 'fullName',
    birthDate: 'birthDate',
    taxId: 'taxId',
    gender: 'gender',
    phone: 'phone',
    email: 'email',
} as const;

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
