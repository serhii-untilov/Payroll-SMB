import { langPipe } from '../utils/lib/langPipe';
import { Accounting } from './../resources/accounting/entities/accounting.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { AccountingType } from '../types';

const lang = process.env.LANGUAGE ?? 'uk';
const entity = Accounting;
const recordList = [
    { id: 1, name: { en: 'Generic', uk: 'Загальний' }, type: AccountingType.Generic },
    { id: 2, name: { en: 'Kindergarten', uk: 'Дитсадок' }, type: AccountingType.Kindergarten },
    { id: 3, name: { en: 'Services', uk: 'Послуги' }, type: AccountingType.Services },
    { id: 4, name: { en: 'Trade', uk: 'Торгівля' }, type: AccountingType.Trade },
    { id: 5, name: { en: 'Custom', uk: 'Довільний' }, type: AccountingType.Custom },
];

export class Seed1809290168967 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const dataSource = queryRunner.connection;
        for (let n = 0; n < recordList.length; n++) {
            await dataSource
                .createQueryBuilder()
                .insert()
                .into(entity)
                .values(langPipe(lang, recordList[n]))
                .orUpdate(['name', 'type'], ['id'])
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
