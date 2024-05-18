import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1715940933610 implements MigrationInterface {
    name = 'Gen1715940933610';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ADD "parentId" integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payroll" DROP COLUMN "parentId"
        `);
    }
}
