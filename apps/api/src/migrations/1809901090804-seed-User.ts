import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../resources/users/entities/user.entity';
import { langPipe } from '../utils/langPipe';

const lang = process.env.LANGUAGE;
const entity = User;
const recordList = [
    {
        id: 1,
        firstName: { en: 'Admin', uk: 'Адміністратор' },
        lastName: '',
        email: 'admin@mail.com',
        password: 'admin',
        roleId: 1,
    },
    {
        id: 2,
        firstName: { en: 'User', uk: 'Користувач' },
        lastName: '',
        email: 'user@mail.com',
        password: 'user',
        roleId: 2,
    },
    {
        id: 3,
        firstName: { en: 'Guest', uk: 'Гість' },
        lastName: '',
        email: 'guest@mail.com',
        password: 'guest',
        roleId: 4,
    },
];

export class Seed1809901090804 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            const values = langPipe(lang, recordList[n]);
            const hashedPassword = bcrypt.hashSync(values.password, 10);
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values({ ...values, password: hashedPassword })
                .orUpdate(['firstName', 'lastName', 'email', 'password'], ['id'])
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
                .where('firstName = :firstName', { firstName: record.firstName })
                .execute();
        }
    }
}
