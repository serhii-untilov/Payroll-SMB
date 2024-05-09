import { PartialType } from '@nestjs/swagger';
import { IUpdateCompany } from '@repo/shared';
import { CreateCompanyDto } from './create-company.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) implements IUpdateCompany {}
