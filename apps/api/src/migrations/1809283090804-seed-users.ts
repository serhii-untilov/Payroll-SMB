import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../resources/user/entities/user.entity';
import { langPipe } from '../utils/lib/lang-pipe';

const lang = process.env.LANGUAGE ?? 'uk';
const entity = User;
const recordList = [
    {
        id: '1',
        firstName: { en: 'System', uk: 'Система' },
        lastName: '',
        email: 'system@payroll.smb',
        password: null, // To prevent this user from logging in.
    },
    {
        id: '2',
        firstName: { en: 'System Admin', uk: 'Адміністратор системи' },
        lastName: '',
        email: 'system.admin@payroll.smb',
        password: 'admin',
    },
    {
        id: '3',
        firstName: { en: 'Company Admin', uk: 'Адміністратор підприємства' },
        lastName: '',
        email: 'company.admin@payroll.smb',
        password: 'admin',
    },
    {
        id: '4',
        firstName: { en: 'Accountant', uk: 'Бухгалтер' },
        lastName: '',
        email: 'accountant@payroll.smb',
        password: 'accountant',
    },
    {
        id: '5',
        firstName: { en: 'Employee', uk: 'Працівник' },
        lastName: '',
        email: 'employee@payroll.smb',
        password: 'employee',
    },
    {
        id: '6',
        firstName: { en: 'Manager', uk: 'Керівник' },
        lastName: '',
        email: 'manager@payroll.smb',
        password: 'manager',
    },
    {
        id: '7',
        firstName: { en: 'Maria', uk: 'Марія' },
        lastName: { en: 'Carefree', uk: 'Безтурботна' },
        email: 'demo@payroll.smb',
        password: 'demo',
    },
];

export class Seed1809283090804 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const { password, ...record } = langPipe(lang, recordList[n]);
            record['password_hash'] = password ? bcrypt.hashSync(password, 10) : null;
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                .orUpdate(['first_name', 'last_name', 'password_hash', 'email'], ['id'])
                .execute();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const record = langPipe(lang, recordList[n]);
            await dataSource.createQueryBuilder().delete().from(entity).where('id = :id', { id: record.id }).execute();
        }
    }
}
