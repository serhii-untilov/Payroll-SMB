import { RoleType } from '../types';
import * as bcrypt from 'bcrypt';
import { getRoleIdByType } from '../utils/lib/getSystemRoleId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from './../resources/users/entities/user.entity';
import { langPipe } from '../utils/lib/langPipe';

const lang = process.env.LANGUAGE || 'uk';
const entity = User;
const recordList = [
    {
        firstName: { en: 'Maria', uk: 'Марія' },
        lastName: { en: 'Carefree', uk: 'Безтурботна' },
        email: 'demo@payroll.smb',
        password: 'demo',
        roleType: RoleType.EMPLOYER || 'employer',
    },
];

export class Seed1817860370287 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const values = langPipe(lang, recordList[n]);
            const hashedPassword = values.password ? bcrypt.hashSync(values.password, 10) : '';
            const roleId = await getRoleIdByType(dataSource, values.roleType);
            delete values.roleType;
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
