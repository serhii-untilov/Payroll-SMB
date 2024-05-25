import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1716557356444 implements MigrationInterface {
    name = 'Gen1716557356444';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE UNIQUE INDEX "MIN_WAGE_DATE_FROM_INDEX" ON "min_wage" ("dateFrom", "dateTo", "paySum")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."MIN_WAGE_DATE_FROM_INDEX"
        `);
    }
}
