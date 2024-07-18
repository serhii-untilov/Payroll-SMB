import { ResourceType, RoleType } from '@/types';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Access } from '@/resources';
import { getSystemUserId } from '../utils/lib/getSystemUserId';
import { generateAccess_Full, generateAccess_ReadOnly } from '../utils/lib/access';

// Default access rules by Role Type.
// This table is read only for all role types. Changes for this table available only by migrations.
// Access config for Roles and Users in extra tables: RoleAccess, UserAccess - coming soon.

const entity = Access;
const recordList = [
    // SYSTEM
    // This role is used to update, migrate, and seed DB only and doesn't have
    // access to any resource through the API.

    // ADMIN
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PAY_FUND),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.MIN_WAGE),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.MAX_BASE_UFC),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.TASK),
    // EMPLOYER
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.PAY_FUND),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.MIN_WAGE),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.MAX_BASE_UFC),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.TASK),
    // OBSERVER
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.PAY_FUND),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.MIN_WAGE),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.MAX_BASE_UFC),
    // ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.TASK),

    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.PAY_FUND),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.MIN_WAGE),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.MAX_BASE_UFC),
    ...generateAccess_Full(RoleType.OBSERVER, ResourceType.TASK),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.PAY_FUND),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.MIN_WAGE),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.MAX_BASE_UFC),
    // ...generateAccess_Full(RoleType.OBSERVER, ResourceType.TASK),
];

export class Seed1817492379121 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = { ...recordList[n], createdUserId: userId, updatedUserId: userId };
            await dataSource.createQueryBuilder().insert().into(entity).values(record).execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = recordList[n];
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where(
                    'roleType = :roleType AND resourceType = :resourceType AND accessType = :accessType AND createdUserId = :userId',
                    {
                        roleType: record.roleType,
                        resourceType: record.resourceType,
                        accessType: record.accessType,
                        userId,
                    },
                )
                .execute();
        }
    }
}
