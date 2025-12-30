import { RoleType } from '../types';
import * as bcrypt from 'bcrypt';
import { getRoleIdByType } from '../utils/lib/getSystemRoleId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../resources/users/entities/user.entity';
import { langPipe } from '../utils/lib/langPipe';
import { getSystemUserId } from '@/utils';

const lang = process.env.LANGUAGE ?? 'uk';
const entity = User;
const recordList = [
    {
        id: '1',
        firstName: { en: 'System', uk: 'Система' },
        lastName: '',
        email: 'system@payroll.smb',
        password: null, // To prevent this user from logging in.
        roleType: RoleType.System ?? 'system',
    },
    {
        id: '2',
        firstName: { en: 'Admin', uk: 'Адміністратор' },
        lastName: '',
        email: 'admin@payroll.smb',
        password: 'admin',
        roleType: RoleType.SystemAdmin ?? 'admin',
    },
    {
        id: '3',
        firstName: { en: 'User', uk: 'Користувач' },
        lastName: '',
        email: 'user@payroll.smb',
        password: 'user',
        roleType: RoleType.Accountant ?? 'employer',
    },
    {
        id: '4',
        firstName: { en: 'User', uk: 'Працівник' },
        lastName: '',
        email: 'employee@payroll.smb',
        password: 'employee',
        roleType: RoleType.Employee ?? 'employee',
    },
    {
        id: '5',
        firstName: { en: 'Guest', uk: 'Гість' },
        lastName: '',
        email: 'guest@payroll.smb',
        password: 'guest',
        roleType: RoleType.Manager ?? 'guest',
    },
    {
        id: '6',
        firstName: { en: 'Maria', uk: 'Марія' },
        lastName: { en: 'Carefree', uk: 'Безтурботна' },
        email: 'demo@payroll.smb',
        password: 'demo',
        roleType: RoleType.Accountant ?? 'employer',
    },
];

export class Seed1809283090804 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const { roleType, ...record } = recordList[n];
            record['createdUserId'] = userId;
            record['updatedUserId'] = userId;
            record['password'] = record.password ? bcrypt.hashSync(record.password, 10) : '';
            record['roleId'] = await getRoleIdByType(dataSource, roleType);
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                .orUpdate(
                    ['first_name', 'last_name', 'password', 'email', 'role_id', 'updated_user_id'],
                    ['id'],
                )
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = langPipe(lang, recordList[n]);
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('id = :id and createdUserId = :userId', { id: record.id, userId })
                .execute();
        }
    }
}
