import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Company } from '../entities/company.entity';

export class UpdateCompanyDto extends PartialType(
    OmitType(Company, [
        'id',
        'owner',
        'createdDate',
        'createdUser',
        'updatedDate',
        'deletedDate',
        'deletedUser',
        'version',
    ]),
) {}
