import { ResourceType, RoleType } from '../types';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Access } from './../resources/access/entities/access.entity';
import { getSystemUserId } from '../utils/lib/getSystemUserId';
import { generateAccess_Full, generateAccess_ReadOnly } from '../utils/lib/access';

// Default access rules by Role Type.
// This table is read only for all role types. Changes for this table available only by migrations.
// Access config for Roles and Users in extra tables: RoleAccess, UserAccess - coming soon.

const entity = Access;
const recordList = [
    // SYSTEM
    // This role is used to update, migrate, and seed DB only and doesn't have access
    // to any resource through the API.

    // ADMIN
    ...generateAccess_ReadOnly(RoleType.ADMIN, ResourceType.Access),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.RoleAccess),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.UserAccess),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Role),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.User),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Profile),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Dashboard),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Company),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Job),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Department),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Manager),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Account),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.WorkNorm),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PaymentType),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.PayPeriod),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Position),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Person),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Vacancy),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Candidate),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Dismissed),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.TimeOff),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Documents),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Notes),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.TimeSheet),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Payroll),
    ...generateAccess_Full(RoleType.ADMIN, ResourceType.Report),

    // EMPLOYER
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.Access),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.UserAccess),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.Role),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.User),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Profile),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Dashboard),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.Job),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Department),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Manager),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Account),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.EMPLOYER, ResourceType.PaymentType),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.PayPeriod),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Position),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Person),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Vacancy),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Candidate),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Dismissed),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.TimeOff),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Documents),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Notes),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.TimeSheet),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Payroll),
    ...generateAccess_Full(RoleType.EMPLOYER, ResourceType.Report),
    // OBSERVER
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Access),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.UserAccess),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Role),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.User),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Profile),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Dashboard),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Job),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Department),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Manager),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Account),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.PaymentType),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Position),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Person),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Vacancy),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Candidate),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Dismissed),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.TimeOff),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Documents),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Notes),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.TimeSheet),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Payroll),
    ...generateAccess_ReadOnly(RoleType.OBSERVER, ResourceType.Report),

    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.UserAccess),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Role),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.User),
    ...generateAccess_Full(RoleType.EMPLOYEE, ResourceType.Profile),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Dashboard),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Job),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Department),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Manager),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.PaymentType),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Position),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Person),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.VACANCY),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.CANDIDATE),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.DISMISSED),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.TimeOff),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Documents),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Notes),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.TimeSheet),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Payroll),
    ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.Report),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.UserAccess),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.ROLE),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.User),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.Profile),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.Dashboard),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.Job),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.Department),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.MANAGER),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.PaymentType),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.Position),
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
        const userId = await getSystemUserId(dataSource);
        if (!userId) throw new Error('userId not defined.');
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
                    `roleType = :roleType AND resourceType = :resourceType AND accessType = :accessType AND createdUserId = :userId`,
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
