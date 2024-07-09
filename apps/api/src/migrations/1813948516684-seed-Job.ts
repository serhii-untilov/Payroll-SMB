import { MigrationInterface, QueryRunner } from 'typeorm';
import { Job } from './../resources/jobs/entities/job.entity';
import { getSystemUserId } from '../utils/getSystemUserId';
import { langPipe } from '../utils/langPipe';

const lang = process.env.LANGUAGE || 'uk';
const entity = Job;
const recordList = [
    { name: { en: 'Director', uk: 'Директор' } },
    { name: { en: 'Marketing Manager', uk: 'Менеджер з маркетингу' } },
    { name: { en: 'Account Manager', uk: 'Менеджер по роботі з клієнтами' } },
    { name: { en: 'Client support manager', uk: 'Менеджер з підтримки клієнтів' } },
    { name: { en: 'Accountant', uk: 'Бухгалтер' } },
    { name: { en: 'Manager', uk: 'Керівник' } },
    { name: { en: 'Specialist', uk: 'Спеціаліст' } },
    { name: { en: 'Assistant', uk: 'Асистент' } },
    { name: { en: 'Seller', uk: 'Продавець' } },
    { name: { en: 'Educator', uk: 'Вихователь' } },
    { name: { en: `Educator's assistant`, uk: 'Помічник вихователя' } },
    { name: { en: `Cook`, uk: 'Кухар' } },
    { name: { en: 'Driver', uk: 'Водій' } },
    { name: { en: 'Guardian', uk: 'Охоронець' } },
    { name: { en: 'Employee', uk: 'Працівник' } },
    { name: { en: 'Contractor', uk: 'Підрядник' } },
];

export class Seed1813948516684 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        const userId = await getSystemUserId(dataSource);
        for (let n = 0; n < recordList.length; n++) {
            const record = { ...recordList[n], createdUserId: userId, updatedUserId: userId };
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                // .orUpdate(['name'], ['id'])
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
                .where('name = :name and createdUserId = :userId', { name: record.name, userId })
                .execute();
        }
    }
}
