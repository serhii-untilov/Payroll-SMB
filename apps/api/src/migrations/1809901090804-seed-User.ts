import { RoleType } from '@/types';
import * as bcrypt from 'bcrypt';
import { getRoleIdByType } from '../utils/lib/getSystemRoleId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '@/resources';
import { langPipe } from '../utils/lib/langPipe';

const lang = process.env.LANGUAGE || 'uk';
const entity = User;
const recordList = [
    {
        firstName: { en: 'System', uk: 'Система' },
        lastName: '',
        email: 'system@payroll.smb',
        password: null, // To prevent this user from logging in.
        roleType: RoleType.SYSTEM || 'system',
    },
    {
        firstName: { en: 'Admin', uk: 'Адміністратор' },
        lastName: '',
        email: 'admin@payroll.smb',
        password: 'admin',
        roleType: RoleType.ADMIN || 'admin',
    },
    {
        firstName: { en: 'User', uk: 'Користувач' },
        lastName: '',
        email: 'user@payroll.smb',
        password: 'user',
        roleType: RoleType.EMPLOYER || 'employer',
    },
    {
        firstName: { en: 'User', uk: 'Працівник' },
        lastName: '',
        email: 'employee@payroll.smb',
        password: 'employee',
        roleType: RoleType.EMPLOYEE || 'employee',
    },
    {
        firstName: { en: 'Guest', uk: 'Гість' },
        lastName: '',
        email: 'guest@payroll.smb',
        password: 'guest',
        roleType: RoleType.GUEST || 'guest',
    },
];

export class Seed1809901090804 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const { roleType: _, ...values } = langPipe(lang, recordList[n]);
            const hashedPassword = values.password ? bcrypt.hashSync(values.password, 10) : '';
            const roleId = await getRoleIdByType(dataSource, values.roleType);
            values['roleId'] = roleId;
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values({ ...values, password: hashedPassword })
                // .orUpdate(['firstName', 'lastName', 'password'], ['email'])
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const record = langPipe(lang, recordList[n]);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('email = :email', { email: record.email })
                .execute();
        }
    }
}
