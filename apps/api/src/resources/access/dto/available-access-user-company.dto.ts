import { PickType } from '@nestjs/swagger';
import { Access } from '../entities/access.entity';

export class AvailableAccessUserCompanyDto extends PickType(Access, [
    'resourceType',
    'accessType',
]) {
    userId: number;
    companyId: number;
}
