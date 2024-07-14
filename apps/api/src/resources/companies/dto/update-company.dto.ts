import { PartialType, OmitType, IntersectionType, PickType } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class UpdateCompanyDto extends IntersectionType(
    PickType(Company, ['version']),
    PartialType(
        OmitType(Company, [
            'id',
            'accounting',
            'law',
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
