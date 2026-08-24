import { AccessCheckDto } from '@/resources/user-access/dto/access-check.dto';
import { RoleType } from '@/types';

export const IUserAccessService = Symbol('IUserAccessService');

export interface IUserAccessService {
    // can(...args: any[]): Promise<boolean>;
    isAllowed(dto: AccessCheckDto): Promise<boolean>;
    canManageRole(current: RoleType, target: RoleType): boolean;
}
