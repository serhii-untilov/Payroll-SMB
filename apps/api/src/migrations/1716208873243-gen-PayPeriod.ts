import { MigrationInterface, QueryRunner } from 'typeorm';

export class Gen1716208873243 implements MigrationInterface {
    name = 'Gen1716208873243';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "accruals" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period"
            ADD "deductions" numeric(15, 2) NOT NULL DEFAULT '0'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "deductions"
        `);
        await queryRunner.query(`
            ALTER TABLE "pay_period" DROP COLUMN "accruals"
        `);
    }
}
