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
    ...generateAccess_ReadOnly(RoleType.Admin, ResourceType.Access),
    ...generateAccess_Full(RoleType.Admin, ResourceType.RoleAccess),
    ...generateAccess_Full(RoleType.Admin, ResourceType.UserAccess),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Role),
    ...generateAccess_Full(RoleType.Admin, ResourceType.User),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Profile),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Dashboard),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Company),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Job),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Department),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Manager),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Account),
    ...generateAccess_Full(RoleType.Admin, ResourceType.WorkNorm),
    ...generateAccess_Full(RoleType.Admin, ResourceType.PaymentType),
    ...generateAccess_Full(RoleType.Admin, ResourceType.PayPeriod),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Position),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Person),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Vacancy),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Candidate),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Dismissed),
    ...generateAccess_Full(RoleType.Admin, ResourceType.TimeOff),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Documents),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Notes),
    ...generateAccess_Full(RoleType.Admin, ResourceType.TimeSheet),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Payroll),
    ...generateAccess_Full(RoleType.Admin, ResourceType.Report),

    // EMPLOYER
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.Access),
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.UserAccess),
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.Role),
    ...generateAccess_Full(RoleType.Employer, ResourceType.User),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Profile),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Dashboard),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.Job),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Department),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Manager),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Account),
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.Employer, ResourceType.PaymentType),
    ...generateAccess_Full(RoleType.Employer, ResourceType.PayPeriod),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Position),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Person),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Vacancy),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Candidate),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Dismissed),
    ...generateAccess_Full(RoleType.Employer, ResourceType.TimeOff),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Documents),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Notes),
    ...generateAccess_Full(RoleType.Employer, ResourceType.TimeSheet),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Payroll),
    ...generateAccess_Full(RoleType.Employer, ResourceType.Report),
    // OBSERVER
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Access),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.UserAccess),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Role),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.User),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Profile),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Dashboard),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Job),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Department),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Manager),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Account),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.PaymentType),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Position),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Person),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Vacancy),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Candidate),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Dismissed),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.TimeOff),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Documents),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Notes),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.TimeSheet),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Payroll),
    ...generateAccess_ReadOnly(RoleType.Observer, ResourceType.Report),

    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.UserAccess),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Role),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.User),
    ...generateAccess_Full(RoleType.Employee, ResourceType.Profile),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Dashboard),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Job),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Department),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Manager),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.PaymentType),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Position),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Person),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.VACANCY),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.CANDIDATE),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, ResourceType.DISMISSED),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.TimeOff),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Documents),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Notes),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.TimeSheet),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Payroll),
    ...generateAccess_ReadOnly(RoleType.Employee, ResourceType.Report),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.UserAccess),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.ROLE),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.User),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.Profile),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.Dashboard),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.Company),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.Job),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.Department),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.MANAGER),
    // ...generateAccess_ReadOnly(RoleType.GUEST, ResourceType.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.WorkNorm),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.PaymentType),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.Guest, ResourceType.Position),
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
