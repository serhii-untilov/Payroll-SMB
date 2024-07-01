import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1719762431265 implements MigrationInterface {
    name = 'Gen1719762431265';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE INDEX "IDX_PAYMENT_COMP_ACC_STATUS" ON "payment" ("companyId", "accPeriod", "status")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PAYMENT_COMP_ACC_STATUS"
        `);
    }
}
