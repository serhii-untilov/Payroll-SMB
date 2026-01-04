import { Resource, RoleType } from '../types';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Access } from '../resources/access/entities/access.entity';
import { getSystemUserId } from '../utils/lib/system-user';
import { generateAccess_Full, generateAccess_ReadOnly } from '../utils/lib/access';
import { IdGenerator } from '@/snowflake/snowflake.singleton';

// Default access rules by Role Type.
// This table is read only for all role types. Changes for this table available only by migrations.
// Access config for Roles and Users in extra tables: RoleAccess, UserAccess - coming soon.

const entity = Access;
const recordList = [
    // SYSTEM
    // This role is used to update, migrate, and seed DB only and doesn't have
    // access to any resource through the API.

    // ADMIN
    ...generateAccess_ReadOnly(RoleType.SystemAdmin, Resource.Access),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.RoleAccess),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.UserAccess),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Role),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.User),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Profile),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Dashboard),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Company),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Job),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Department),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Manager),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Account),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.WorkTimeNorm),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.PaymentType),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.PayPeriod),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Position),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Person),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Vacancy),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Candidate),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Dismissed),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.TimeOff),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Document),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Notes),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Timesheet),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Payroll),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Report),

    // EMPLOYER
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.Access),
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.UserAccess),
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.Role),
    ...generateAccess_Full(RoleType.Accountant, Resource.User),
    ...generateAccess_Full(RoleType.Accountant, Resource.Profile),
    ...generateAccess_Full(RoleType.Accountant, Resource.Dashboard),
    ...generateAccess_Full(RoleType.Accountant, Resource.Company),
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.Job),
    ...generateAccess_Full(RoleType.Accountant, Resource.Department),
    ...generateAccess_Full(RoleType.Accountant, Resource.Manager),
    ...generateAccess_Full(RoleType.Accountant, Resource.Account),
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.WorkTimeNorm),
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.PaymentType),
    ...generateAccess_Full(RoleType.Accountant, Resource.PayPeriod),
    ...generateAccess_Full(RoleType.Accountant, Resource.Position),
    ...generateAccess_Full(RoleType.Accountant, Resource.Person),
    ...generateAccess_Full(RoleType.Accountant, Resource.Vacancy),
    ...generateAccess_Full(RoleType.Accountant, Resource.Candidate),
    ...generateAccess_Full(RoleType.Accountant, Resource.Dismissed),
    ...generateAccess_Full(RoleType.Accountant, Resource.TimeOff),
    ...generateAccess_Full(RoleType.Accountant, Resource.Document),
    ...generateAccess_Full(RoleType.Accountant, Resource.Notes),
    ...generateAccess_Full(RoleType.Accountant, Resource.Timesheet),
    ...generateAccess_Full(RoleType.Accountant, Resource.Payroll),
    ...generateAccess_Full(RoleType.Accountant, Resource.Report),
    // OBSERVER
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Access),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.UserAccess),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Role),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.User),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Profile),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Dashboard),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Company),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Job),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Department),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Manager),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Account),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.WorkTimeNorm),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PaymentType),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Position),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Person),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Vacancy),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Candidate),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Dismissed),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.TimeOff),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Document),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Notes),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Timesheet),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Payroll),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Report),

    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.UserAccess),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Role),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.User),
    ...generateAccess_Full(RoleType.Employee, Resource.Profile),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Dashboard),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Company),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Job),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Department),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Manager),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, Resource.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.WorkTimeNorm),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.PaymentType),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Position),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Person),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, Resource.VACANCY),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, Resource.CANDIDATE),
    // ...generateAccess_ReadOnly(RoleType.EMPLOYEE, Resource.DISMISSED),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.TimeOff),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Document),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Notes),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Timesheet),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Payroll),
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Report),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.RoleAccess),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.UserAccess),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.ROLE),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.User),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Profile),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Dashboard),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Company),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Job),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Department),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.MANAGER),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.ACCOUNT),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.WorkTimeNorm),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PaymentType),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PayPeriod),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Position),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.PERSON),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.VACANCY),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.CANDIDATE),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.DISMISSED),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.TIME_OFF),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.DOCUMENTS),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.NOTES),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.TIME_SHEET),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.PAYROLL),
    // ...generateAccess_ReadOnly(RoleType.GUEST, Resource.REPORT),

    // ADMIN
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.PayFund),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.MinWage),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.MaxBaseUfc),
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Task),
    // EMPLOYER
    ...generateAccess_Full(RoleType.Accountant, Resource.PayFund),
    ...generateAccess_Full(RoleType.Accountant, Resource.MinWage),
    ...generateAccess_Full(RoleType.Accountant, Resource.MaxBaseUfc),
    ...generateAccess_Full(RoleType.Accountant, Resource.Task),
    // OBSERVER
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PayFund),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.MinWage),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.MaxBaseUfc),
    // ...generateAccess_ReadOnly(RoleType.OBSERVER, Resource.TASK),

    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PayFund),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.MinWage),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.MaxBaseUfc),
    ...generateAccess_Full(RoleType.Manager, Resource.Task),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.PayFund),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.MinWage),
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.MaxBaseUfc),
    // ...generateAccess_Full(RoleType.OBSERVER, Resource.TASK),

    // EMPLOYER
    ...generateAccess_ReadOnly(RoleType.Accountant, Resource.Demo),

    // ADMIN
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.Payment),
    // EMPLOYER
    ...generateAccess_Full(RoleType.Accountant, Resource.Payment),
    // OBSERVER
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Payment),
    // EMPLOYEE
    ...generateAccess_ReadOnly(RoleType.Employee, Resource.Payment),
    // GUEST
    ...generateAccess_ReadOnly(RoleType.Manager, Resource.Payment),

    // ADMIN
    ...generateAccess_Full(RoleType.SystemAdmin, Resource.PaymentPosition),
    // EMPLOYER
    ...generateAccess_Full(RoleType.Accountant, Resource.PaymentPosition),
];

export class Seed1819288749808 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        IdGenerator.init();
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = {
                ...recordList[n],
                createdUserId: userId,
                updatedUserId: userId,
                id: IdGenerator.nextId(),
            };
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
                    'role_type = :role_type AND resource = :resource AND action = :action AND created_user_id = :user_id',
                    {
                        role_type: record.roleType,
                        resource: record.resource,
                        action: record.action,
                        user_id: userId,
                    },
                )
                .execute();
        }
    }
}
