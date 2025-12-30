import { PickType } from '@nestjs/swagger';
import { Access } from '../entities/access.entity';

export class AvailableAccessUserCompanyDto extends PickType(Access, ['resource', 'action']) {
    userId: string;
    companyId: string;
}
