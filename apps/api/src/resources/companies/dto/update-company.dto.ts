import { PartialType, OmitType } from '@nestjs/swagger';
import { Company } from '../entities/company.entity';

export class UpdateCompanyDto extends PartialType(OmitType(Company, ['id'])) {}
