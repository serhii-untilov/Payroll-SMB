import { langPipe } from '../utils/langPipe';
import { Accounting } from '../resources/accounting/entities/accounting.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { AccountingType } from '@repo/shared';

const lang = process.env.LANGUAGE;
const entity = Accounting;
const recordList = [
    { id: 1, name: { en: 'Generic', uk: 'Загальний' }, type: AccountingType.GENERIC },
    { id: 2, name: { en: 'Kindergarten', uk: 'Дитсадок' }, type: AccountingType.KINDERGARTEN },
    { id: 3, name: { en: 'Services', uk: 'Послуги' }, type: AccountingType.SERVICES },
    { id: 4, name: { en: 'Trade', uk: 'Торгівля' }, type: AccountingType.TRADE },
    { id: 5, name: { en: 'Custom', uk: 'Довільний' }, type: AccountingType.CUSTOM },
];

export class Seed1709290168967 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        recordList.forEach(async (record) => {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, record))
                .orUpdate(['name', 'type'], ['id'])
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
