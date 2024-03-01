import { langPipe } from '../utils/langPipe';
import { Law } from '../resources/laws/entities/law.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { LawType } from '@repo/shared';

const lang = process.env.LANGUAGE;
const entity = Law;
const recordList = [{ id: 1, name: { en: 'Ukraine', uk: 'Україна' }, type: LawType.UKRAINE }];

export class Seed1709290156431 implements MigrationInterface {
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
