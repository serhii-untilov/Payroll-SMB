import { OmitType, PartialType } from '@nestjs/swagger';
import { UserCompany } from '../entities/user-company.entity';
import { IUpdateUserCompany } from '@repo/shared';

export class UpdateUserCompanyDto
    extends PartialType(OmitType(UserCompany, ['id']))
    implements IUpdateUserCompany {}
