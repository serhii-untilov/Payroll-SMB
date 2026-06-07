import { AccessCheckDto } from '@/resources/user-access/dto/access-check.dto';
import { RoleType } from '@/types';

export interface IUserAccessService {
    // can(...args: any[]): Promise<boolean>;
    isAllowed(dto: AccessCheckDto): Promise<boolean>;
    canManageRole(current: RoleType, target: RoleType): boolean;
}
