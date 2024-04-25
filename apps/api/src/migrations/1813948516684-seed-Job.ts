import { getAdminId } from '../utils/getAdminId';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Job } from '../resources/jobs/entities/job.entity';
import { langPipe } from '../utils/langPipe';

const lang = process.env.LANGUAGE;
const entity = Job;
const recordList = [
    { id: 1, name: { en: 'Director', uk: 'Директор' } },
    { id: 2, name: { en: 'Marketing Manager', uk: 'Менеджер з маркетингу' } },
    { id: 3, name: { en: 'Account Manager', uk: 'Менеджер по роботі з клієнтами' } },
    { id: 4, name: { en: 'Client support manager', uk: 'Менеджер з підтримки клієнтів' } },
    { id: 5, name: { en: 'Accountant', uk: 'Бухгалтер' } },
    { id: 6, name: { en: 'Manager', uk: 'Керівник' } },
    { id: 7, name: { en: 'Developer', uk: 'Розробник' } },
    { id: 8, name: { en: 'Tester', uk: 'Тестувальник' } },
    { id: 9, name: { en: 'Specialist', uk: 'Спеціаліст' } },
    { id: 10, name: { en: 'Assistant', uk: 'Асистент' } },
    { id: 11, name: { en: 'Office Administrator', uk: 'Адміністратор офісу' } },
    { id: 12, name: { en: 'Seller', uk: 'Продавець' } },
    { id: 13, name: { en: 'Educator', uk: 'Вихователь' } },
    { id: 14, name: { en: `Educator's assistant`, uk: 'Помічник вихователя' } },
    { id: 15, name: { en: `Cook`, uk: 'Кухар' } },
    { id: 16, name: { en: 'Driver', uk: 'Водій' } },
    { id: 17, name: { en: 'Guardian', uk: 'Охоронець' } },
    { id: 18, name: { en: 'Employee', uk: 'Працівник' } },
    { id: 19, name: { en: 'Contractor', uk: 'Підрядник' } },
];

export class Seed1813948516684 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const user_id = await getAdminId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = { ...recordList[n], createdUserId: user_id, updatedUserId: user_id };
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                .orUpdate(['name'], ['id'])
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
                .where('name = :name', { name: record.name })
                .execute();
        }
    }
}
