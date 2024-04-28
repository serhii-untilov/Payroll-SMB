import { AccessType, ICreateAccess, ResourceType, RoleType } from '@repo/shared';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Access } from '../resources/access/entities/access.entity';
import { getAdminId } from '../utils/getAdminId';

// Default access rules by Role Type.
// This table is read only for all role types. Changes for this table available only by migrations.
// Access config for Roles and Users in extra tables: RoleAccess, UserAccess - coming soon.

const entity = Access;
const recordList = [
    // ADMIN
    // ...generateAccess_Full(RoleType.ADMIN, ResourceType.ACCESS), This table is read only for all role types
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.ROLE_ACCESS),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.USER_ACCESS),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.USER),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PROFILE),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.DASHBOARD),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.COMPANY),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.DEPARTMENT),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.MANAGER),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.ACCOUNT),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PAY_PERIOD),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.POSITION),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PERSON),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.VACANCY),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.CANDIDATE),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.DISMISSED),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.TIME_OFF),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.DOCUMENTS),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.NOTES),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.TIME_SHEET),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PAYROLL),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.REPORT),
    // EMPLOYER
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.ROLE_ACCESS),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.USER_ACCESS),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.USER),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.PROFILE),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.DASHBOARD),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.COMPANY),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.DEPARTMENT),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.MANAGER),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.ACCOUNT),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.PAY_PERIOD),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.POSITION),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.PERSON),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.VACANCY),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.CANDIDATE),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.DISMISSED),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.TIME_OFF),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.DOCUMENTS),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.NOTES),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.TIME_SHEET),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.PAYROLL),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.REPORT),
    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.ROLE_ACCESS),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.USER_ACCESS),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.USER),
    ...generateAccess_Full(RoleType.EMPLOYEE, ResourceType.PROFILE),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.DASHBOARD),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.COMPANY),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.DEPARTMENT),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.MANAGER),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.PAY_PERIOD),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.POSITION),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.PERSON),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.VACANCY),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.CANDIDATE),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.DISMISSED),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.TIME_OFF),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.DOCUMENTS),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.NOTES),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.TIME_SHEET),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.PAYROLL),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.REPORT),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.ROLE_ACCESS),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.USER_ACCESS),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.USER),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.PROFILE),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.DASHBOARD),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.COMPANY),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.DEPARTMENT),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.MANAGER),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.PAY_PERIOD),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.POSITION),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.PERSON),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.VACANCY),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.CANDIDATE),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.DISMISSED),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.TIME_OFF),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.DOCUMENTS),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.NOTES),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.TIME_SHEET),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.PAYROLL),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.REPORT),
];

export class Seed1814288965652 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const user_id = await getAdminId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = { ...recordList[n], createdUserId: user_id, updatedUserId: user_id };
            await dataSource.createQueryBuilder().insert().into(entity).values(record).execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const record = recordList[n];
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where(
                    'roleType = :roleType AND resourceType = :resourceType AND accessType = :accessType',
                    {
                        roleType: record.roleType,
                        resourceType: record.resourceType,
                        accessType: record.accessType,
                    },
                )
                .execute();
        }
    }
}

function generateAccess_Full(roleType: RoleType, resourceType: ResourceType): ICreateAccess[] {
    return Object.keys(AccessType).map((key) => {
        return { roleType, resourceType, accessType: AccessType[key] };
    });
}

function generateAccess_ReadOnly(roleType: RoleType, resourceType: ResourceType): ICreateAccess[] {
    return [{ roleType, resourceType, accessType: AccessType.ACCESS }];
}
