import { OmitType, PartialType } from '@nestjs/swagger';
import { UserCompany } from '../entities/user-company.entity';

export class UpdateUserCompanyDto extends PartialType(OmitType(UserCompany, ['id'])) {}
