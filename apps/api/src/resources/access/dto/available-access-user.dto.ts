import { PickType } from '@nestjs/swagger';
import { Access } from '../entities/access.entity';

export class AvailableAccessUserDto extends PickType(Access, ['resourceType', 'accessType']) {
    userId: number;
}
