import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class CreateCompanyDto extends IntersectionType(
    PickType(Company, ['name', 'lawId', 'accountingId']),
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
