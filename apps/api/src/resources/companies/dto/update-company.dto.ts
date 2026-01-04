import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { Company } from './../entities/company.entity';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends IntersectionType(PickType(Company, ['version']), PartialType(CreateCompanyDto)) {}
