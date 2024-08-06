import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1719752427273 implements MigrationInterface {
    name = 'Gen1719752427273';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_SOURCE_TYPE_ID" ON "payroll" ("sourceType", "sourceId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYROLL_POSITION_PAY_PERIOD" ON "payroll" ("positionId", "payPeriod")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_POSITION_PAY_PERIOD"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYROLL_SOURCE_TYPE_ID"
        `);
    }
}
