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
    },
    {
        id: 2,
        firstName: { en: 'User', uk: 'Користувач' },
        lastName: '',
        email: 'user@mail.com',
        password: 'user',
    },
    {
        id: 3,
        firstName: { en: 'Guest', uk: 'Гість' },
        lastName: '',
        email: 'guest@mail.com',
        password: 'guest',
    },
];

export class Seed1709301090804 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        recordList.forEach(async (record) => {
            const values = langPipe(lang, record);
            const hashedPassword = bcrypt.hashSync(values.password, 10);
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values({ ...values, password: hashedPassword })
                .orUpdate(['firstName', 'lastName', 'email', 'password'], ['id'])
                .execute();
        });
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        recordList.forEach(async (record) => {
            await dataSource
                .createQueryBuilder()
                .delete()
                .from(entity)
                .where('id = :id', { id: record.id })
                .execute();
        });
    }
}
