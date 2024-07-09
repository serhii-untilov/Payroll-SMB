import { langPipe } from '../utils/langPipe';
import { Law } from '@/resources/laws/entities/law.entity';
import { MigrationInterface, QueryRunner } from 'typeorm';
import { LawType } from '@repo/shared';

const lang = process.env.LANGUAGE || 'uk';
const entity = Law;
const recordList = [{ id: 1, name: { en: 'Ukraine', uk: 'Україна' }, type: LawType.UKRAINE }];

export class Seed1809290156431 implements MigrationInterface {
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
