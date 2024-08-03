import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1722703625948 implements MigrationInterface {
    name = 'Gen1722703625948';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "sex" DROP NOT NULL
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_SOURCE_TYPE_ID"
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll" DROP COLUMN "sourceType"
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ADD "sourceType" character varying(20) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_SOURCE_TYPE_ID" ON "payroll" ("sourceType", "sourceId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_SOURCE_TYPE_ID"
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll" DROP COLUMN "sourceType"
        `);
        await queryRunner.query(`
            ALTER TABLE "payroll"
            ADD "sourceType" character varying(10) NOT NULL DEFAULT ''
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_SOURCE_TYPE_ID" ON "payroll" ("sourceType", "sourceId")
        `);
        await queryRunner.query(`
            ALTER TABLE "person"
            ALTER COLUMN "sex"
            SET NOT NULL
        `);
    }
}
